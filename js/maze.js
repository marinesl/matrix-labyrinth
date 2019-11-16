const dirVectors = {
  N: [0, -1],
  S: [0, 1],
  E: [1, 0],
  W: [-1, 0]
}

class Cell {
  constructor (label, x, y, maze) {
    this.label = label
    this.x = x
    this.y = y
    this.maze = maze
  }

  walls () {
    let walls = []
    for (let direction of Object.keys(dirVectors)) {
      walls.push({
        label: this.label,
        direction: direction,
        selectable: (direction === 'W' && this.x > 0) || (direction === 'N' && this.y > 0),
        present: this.maze.hasWall(this.label, direction),
        x: dirVectors[direction][0],
        y: dirVectors[direction][1]
      })
    }
    return walls
  }

  toJSON () {
    return {
      x: this.x,
      y: this.y,
      label: this.label,
      walls: this.walls()
    }
  }
}

Cell.label = function (x, y) {
  return String.fromCharCode('A'.charCodeAt(0) + x) + (y + 1)
}

class Maze {
  constructor (width = 3, height = 3) {
    this.width = width
    this.height = height
    this.setMatrix(new UAdjacencyMatrix(this.width * this.height))
  }

  /**
   * set the adjacency matrix
   */
  setMatrix (matrix) {
    this.matrix = matrix
    this.cell = {}
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        let label = Cell.label(x, y)
        let cell = new Cell(label, x, y, this)
        this.cell[label] = cell
      }
    }
    this.labels = Object.keys(this.cell)
  }

  /**
   * get index from cell label
   */
  cellIndex (label) {
    return this.labels.indexOf(label)
  }

  neighbour (label, direction) {
    let cell = this.cell[label]
    let dx, dy
    [dx, dy] = dirVectors[direction]
    let xnext = Math.max(0, Math.min(this.width - 1, cell.x + dx))
    let ynext = Math.max(0, Math.min(this.height - 1, cell.y + dy))
    if ((cell.x !== xnext) || (cell.y !== ynext)) {
      return Cell.label(xnext, ynext)
    }
  }

  withNeighbour (label, direction, cbk) {
    let next = this.neighbour(label, direction)
    if (next) {
      cbk(next)
    }
  }

  setWall (label1, label2, value) {
    this.matrix.set(this.cellIndex(label1), this.cellIndex(label2), value)
  }

  connect (label, direction, value) {
    this.withNeighbour(label, direction, (label2) => {
      this.setWall(label, label2, value)
    })
  }

  open (label, ...args) {
    for (let direction of args) {
      this.connect(label, direction, true)
    }
  }

  toggle (label, ...args) {
    for (let direction of args) {
      this.connect(label, direction, this.hasWall(label, direction))
    }
  }

  close (label, ...args) {
    for (let direction of arguments) {
      this.connect(label, direction, false)
    }
  }

  hasWall (label, direction) {
    let isOpen = false
    this.withNeighbour(label, direction, (label2) => {
      isOpen = this.matrix.get(this.cellIndex(label), this.cellIndex(label2))
    })
    return !isOpen
  }

  toJSON () {
    return {
      width: this.width,
      height: this.height,
      cells: Object.values(this.cell).map((x) => x.toJSON())
    }
  }

  pathes (from, to) {
    return this.matrix.getPathes(this.cellIndex(from), this.cellIndex(to)).map((p) => {
      return p.map((idx) => this.labels[idx])
    })
  }

  // http://ilay.org/yann/articles/maze/
  // Create a random labyrinth by generating a candidateMatrix with all links (N, S, E, W)
  randomize () {
    this.setMatrix(new UAdjacencyMatrix(this.width * this.height))
    let candidateMatrix = new UAdjacencyMatrix(this.width * this.height)
    for (let x of this.labels) {
      let idx = this.cellIndex(x)
      for (let direction of ['N', 'S', 'W', 'E']) {
        this.withNeighbour(x, direction, (next) => {
          candidateMatrix.set(idx, this.cellIndex(next), true)
        })
      }
    }
    this.matrix.randomize(candidateMatrix)
  }
}
