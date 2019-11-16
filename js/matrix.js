/**
 * TODO: AdjacencyMatrix#getPathes & AdjacencyMatrix#randmize
 */

/**
 * Simple matrix class
 */
class Matrix {
  /**
   * @param {number} width - the width of the matrix
   * @param {number} height - the height of the matrix
   */
  constructor (width = 3, height = 3, defValue = 0) {
    this.values = []
    for (let h = height; h; h--) {
      let row = []
      for (let w = width; w; w--) {
        row.push(defValue)
      }
      this.values.push(row)
    }
  }

  /**
   * Set a matrix cell value
   * @param {number} x - the x coordinate of the cell (from 0)
   * @param {number} y - the y coordinate of the cell (from 0)
   * @param {number|boolean} value - the value associated with the cell
   */
  set (x, y, value = 1) {
    this.values[y][x] = value
  }

  /**
   * Get a matrix cell value
   * @param {number} x - the x coordinate of the cell (from 0)
   * @param {number} y - the y coordinate of the cell (from 0)
   * @return {number|boolean} value - the value associated with the cell
   */
  get (x, y) { return this.values[y][x] }
}

/**
 * square matrix class
 */
class SquareMatrix extends Matrix {
  constructor (dim = 3, defValue = false) {
    super(dim, dim, defValue)
  }
}

/**
 * Adjacency Martix  class
 */
class AdjacencyMatrix extends SquareMatrix {
  /**
   * Set a value for the connexion between two vertices
   * @param {number} a - index of vertex a
   * @param {number} b - index of vertex b
   * @param {number} value
   */
  set (a, b, value = true) {
    super.set(a, b, value)
  }

  /**
   * Get all direct targets from a node
   * @param {number} from - index
   * @return {Array<number>} - target indexes
   */
  targets (from) {
    let targets = []
    for (let k in this.values[from]) {
      if (this.values[from][k]) {
        targets.push(k)
      }
    }
    return targets
  }

  /**
   * Dummy conversion of Matrix to string
   */
  toString () {
    let r = []
    for (let row of this.values) {
      r.push(row.map((x) => x ? '•' : ' ').join('|'))
    }
    return r.join('\n')
  }

  /**
   * Get a list of path between two nodes
   * @param {number} from - origin
   * @param {number} to - destination
   * @param {Array<number>} - the indexes to be processed
   * @return {Array<Array>} - return an array with each path as array of indexes
   */
  getPathes (from, to, indexes) {
    if (indexes === undefined) {
      indexes = []
      for (let k = 0; k < this.values.length; k++) {
        if (k !== from) {
          indexes.push(k)
        }
      }
    }
    let results = []
    let row = this.values[from]
    for (let idx of indexes) {
      if (row[idx]) {
        if (idx === to) {
          results.push([from, idx])
        } else {
          for (let p of this.getPathes(idx, to, indexes.filter((x) => x !== idx))) {
            p.unshift(from)
            results.push(p)
          }
        }
      }
    }
    return results // [[0,1,2,5,4,3,6,7,8],[0,1,4,3,6,7,8]]
  }

  /**
   * TODO
   * Retourne un tableau d'arcs de la matrice représenté sous forme d'objet:
   * [{ from: …, to: …, cost: 1}, …]
   * Où:
   *   `from` a pour valeur l'index du sommet de départ
   *   `to` a pour valeur l'index du sommet d'arrivée
   *   `cost` a pour valeur fixe 1
   * @return {Array<Object>} - An array of all edges { from: …, to: …, cost: 1}
   */
  edges () {
    let results = [];

    for(let i = 0 ; i < this.values.length; i++) {
      for (let target of this.targets(i)) {
        results.push({from: i, to: target, cost: 1});
      }
    }
    return results;

    // return [
    //  {from: 0, to: 1, cost: 1},
    //  {from: 1, to: 0, cost: 1},
    //  {from: 1, to: 2, cost: 1},
    //  {from: 1, to: 4, cost: 1},
    //  {from: 2, to: 1, cost: 1},
    //  {from: 2, to: 5, cost: 1},
    //  {from: 3, to: 4, cost: 1},
    //  {from: 3, to: 6, cost: 1},
    //  {from: 4, to: 1, cost: 1},
    //  {from: 4, to: 3, cost: 1},
    //  {from: 4, to: 5, cost: 1},
    //  {from: 5, to: 2, cost: 1},
    //  {from: 5, to: 4, cost: 1},
    //  {from: 6, to: 3, cost: 1},
    //  {from: 6, to: 7, cost: 1},
    //  {from: 7, to: 6, cost: 1},
    //  {from: 7, to: 8, cost: 1},
    //  {from: 8, to: 7, cost: 1}
    //  ]
  }

  /**
   * TODO
   * Retourne le coût total du chemin depuis un sommet origine  vers tous les
   * autres sommets, en utilisant l'algorithme de Bellman Ford simplifié.
   * Le résultat est un tableau dont la clef est l'index du sommet
   * et dont la valeur est le coût total pour arriver à ce sommet
   * @param {number} origin - l'origine à partir duquel le coût est calculé
   * @return {Array<number>} - array of costs for each destination vertex
   */
  bellmanFord (origin) {
    //  Pseudo code de l'algorithme:
    //
    //   fonction Bellman_Ford(G, s)
    //     pour chaque sommet u du graphe
    //      | d[u] = +∞
    //     d[s] = 0
    //     pour k = 1 jusqu'à Nombre de sommets - 1 faire
    //      |    pour chaque arc (u, t) du graphe faire
    //      |      |    d[t] := min(d[t], d[u] + poids(u, t))
    //     retourner d
    //
    // Ici `G` est le graphe;
    // `s` est un sommet et correspond à `origin`;
    // `d` correspond au tableau de coût (la valeur à retourner)
    // et `u`, `t` & `poids(u, t)` correspondent respectivement à `from`, `to` & `cost`
    // retournés dans le tableau des arcs obtenus par l'appel de this.edges()
    //
    // c.f. https://fr.wikipedia.org/wiki/Algorithme_de_Bellman-Ford
    // (la "version qui calcule en place les distances")
    //

    let results = [];

    for(let i = 0 ; i < this.values.length ; i++) {
      results[i] = Number.POSITIVE_INFINITY;
    }

    results[origin] = 0;

    for(let k = 1 ; k <= this.values.length - 1 ; k++) {
      for(let edge of this.edges()) {
        results[edge.to] = Math.min(results[edge.to] , results[edge.from] + edge.cost);
      }
    }

    return results;

    // return [1, 0, 1, 2, 1, 2, 3, 4, 5] // si `origin` == 1
  }

  /**
   * TODO
   * Randomize the current adjacency matrix in order to have a perfect maze
   * http://ilay.org/yann/articles/maze/
   * @param {AdjacencyMatrix} candidateMatrix - a adjacency matrix for possibles edges
   */
  randomize (candidateMatrix) {
    console.log('randomize -> TODO !')
    this.set(0, 1)
    this.set(1, 2)
    this.set(1, 4)
    this.set(2, 5)
    this.set(3, 4)
    this.set(3, 6)
    this.set(4, 5)
    this.set(6, 7)
    this.set(7, 8)
  }
}

// Undirected adjacency matrix
class UAdjacencyMatrix extends AdjacencyMatrix {
  set (a, b, value = true) {
    super.set(a, b, value)
    super.set(b, a, value)
  }
}

// if (typeof document === 'undefined') { // for testing purpose
  //
  // Maze
  //
  // +---+---+---+
  // | 0   1   2 |
  // +---+   +   +
  // | 3   4   5 |
  // +   +---+---+
  // | 6   7   8 |
  // +---+---+---+
  //
  let matrix = new UAdjacencyMatrix(3 * 3)
  matrix.randomize()
  console.log(matrix.toString())
  // console.log('getPathes: %j', matrix.getPathes(0, 8))
  // console.log('getPathes should display: %j\n', [[0, 1, 2, 5, 4, 3, 6, 7, 8], [0, 1, 4, 3, 6, 7, 8]])
  // console.log('edges: %j', matrix.edges())
  // console.log('edges should display: %j\n', [
     // {from: 0, to: 1, cost: 1}, {from: 1, to: 0, cost: 1},
     // {from: 1, to: 2, cost: 1}, {from: 1, to: 4, cost: 1},
     // {from: 2, to: 1, cost: 1}, {from: 2, to: 5, cost: 1},
     // {from: 3, to: 4, cost: 1}, {from: 3, to: 6, cost: 1},
     // {from: 4, to: 1, cost: 1}, {from: 4, to: 3, cost: 1},
     // {from: 4, to: 5, cost: 1}, {from: 5, to: 2, cost: 1},
     // {from: 5, to: 4, cost: 1}, {from: 6, to: 3, cost: 1},
     // {from: 6, to: 7, cost: 1}, {from: 7, to: 6, cost: 1},
     // {from: 7, to: 8, cost: 1}, {from: 8, to: 7, cost: 1}])
  console.log('bellmanFord: %j', matrix.bellmanFord(1))
  console.log('bellmanFord should display: %j\n', [1, 0, 1, 2, 1, 2, 3, 4, 5])
// }
