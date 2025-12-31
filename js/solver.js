
/**
 * Solver logic for the game.
 * Uses BFS to find the shortest path.
 */

const MOVES = {
    'U': { dx: -1, dy: 0, name: 'Up' },
    'D': { dx: 1, dy: 0, name: 'Down' },
    'L': { dx: 0, dy: -1, name: 'Left' },
    'R': { dx: 0, dy: 1, name: 'Right' }
};

/**
 * Min-Heap implementation for efficient priority queue
 */
class MinHeap {
    constructor(compareFn) {
        this.heap = [];
        this.compareFn = compareFn || ((a, b) => a - b);
    }

    size() {
        return this.heap.length;
    }

    peek() {
        return this.heap[0];
    }

    insert(value) {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
    }

    extractMin() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.heapifyDown(0);
        return min;
    }

    heapifyUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.compareFn(this.heap[index], this.heap[parentIndex]) >= 0) break;
            
            [this.heap[index], this.heap[parentIndex]] = [this.heap[parentIndex], this.heap[index]];
            index = parentIndex;
        }
    }

    heapifyDown(index) {
        while (true) {
            let smallest = index;
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;

            if (leftChild < this.heap.length && 
                this.compareFn(this.heap[leftChild], this.heap[smallest]) < 0) {
                smallest = leftChild;
            }

            if (rightChild < this.heap.length && 
                this.compareFn(this.heap[rightChild], this.heap[smallest]) < 0) {
                smallest = rightChild;
            }

            if (smallest === index) break;

            [this.heap[index], this.heap[smallest]] = [this.heap[smallest], this.heap[index]];
            index = smallest;
        }
    }
}

class Solver {
    constructor(levelStr) {
        this.levelStr = levelStr;
        this.rows = 8;
        this.cols = 8;
        this.staticBoard = this.parseStatic(levelStr); // Walls (*) and Targets (x)
        this.initialDynamicBoard = this.parseDynamic(levelStr); // Pieces (O)
    }

    parseStatic(str) {
        let board = [];
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                let char = str.charAt(i * 8 + j);
                if (char === 'O') row.push('.'); // Piece is not static
                else row.push(char);
            }
            board.push(row);
        }
        return board;
    }

    parseDynamic(str) {
        let board = [];
        for (let i = 0; i < this.rows; i++) {
            let row = [];
            for (let j = 0; j < this.cols; j++) {
                let char = str.charAt(i * 8 + j);
                if (char === 'O') row.push('O');
                else row.push('.');
            }
            board.push(row);
        }
        return board;
    }

    serialize(dynamicBoard) {
        let s = "";
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                s += dynamicBoard[i][j];
            }
        }
        return s;
    }

    isWin(dynamicBoard) {
        let pieces = 0;
        let onTarget = 0;
        let targets = 0;

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.staticBoard[i][j] === 'x') targets++;
                if (dynamicBoard[i][j] === 'O') {
                    pieces++;
                    if (this.staticBoard[i][j] === 'x') onTarget++;
                }
            }
        }
        return pieces > 0 && pieces === targets && onTarget === pieces;
        // Logic from core.js: isWin checks if cnto (pieces on target) == cntx (total targets) (and >0)
        // Wait, core.js logic:
        // if (items[x][y] == "O") return false; // Any piece NOT on target fails?
        // Wait, items[x][y] becomes 'o' if on target.
        // core.js:
        // cnto counts 'o'. cntx counts 'x'.
        // if (cnto > 0 && cnto == cntx) return true.
        // items[x][y] is "O" if piece is there.
        // Loop in core.js initial(): if (itemsF == 'x' && items == 'O') items = 'o'.
        // So checking if all 'O' are on 'x'.
    }

    // Check purely based on board char
    isWinBoard(dynamicBoard) {
        let targets = 0;
        let matches = 0;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (this.staticBoard[r][c] === 'x') {
                    targets++;
                    if (dynamicBoard[r][c] === 'O') matches++;
                } else {
                    // If there is an O on a non-target, does that matter?
                    // The win condition implies ALL targets must be covered.
                    // Usually implies number of pieces equals number of targets.
                }
            }
        }
        return targets > 0 && matches === targets;
    }

    applyMove(board, moveKey) {
        // Clone board
        let newBoard = board.map(row => [...row]);
        let changed = false;

        if (moveKey === 'U') {
            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    if (newBoard[x][y] === 'O') {
                        if (x - 1 >= 0 && this.isValid(x - 1, y, newBoard)) {
                            newBoard[x][y] = '.';
                            newBoard[x - 1][y] = 'O';
                            changed = true;
                        }
                    }
                }
            }
        } else if (moveKey === 'D') {
            for (let x = 7; x >= 0; x--) {
                for (let y = 0; y < 8; y++) {
                    if (newBoard[x][y] === 'O') {
                        if (x + 1 <= 7 && this.isValid(x + 1, y, newBoard)) {
                            newBoard[x][y] = '.';
                            newBoard[x + 1][y] = 'O';
                            changed = true;
                        }
                    }
                }
            }
        } else if (moveKey === 'L') {
            for (let y = 0; y < 8; y++) {
                for (let x = 0; x < 8; x++) {
                    if (newBoard[x][y] === 'O') {
                        if (y - 1 >= 0 && this.isValid(x, y - 1, newBoard)) {
                            newBoard[x][y] = '.';
                            newBoard[x][y - 1] = 'O';
                            changed = true;
                        }
                    }
                }
            }
        } else if (moveKey === 'R') {
            for (let y = 7; y >= 0; y--) {
                for (let x = 0; x < 8; x++) {
                    if (newBoard[x][y] === 'O') {
                        if (y + 1 <= 7 && this.isValid(x, y + 1, newBoard)) {
                            newBoard[x][y] = '.';
                            newBoard[x][y + 1] = 'O';
                            changed = true;
                        }
                    }
                }
            }
        }

        return { board: newBoard, changed };
    }

    isValid(x, y, currentBoard) {
        // Check static walls
        if (this.staticBoard[x][y] === '*') return false;
        // Check dynamic pieces (collision)
        if (currentBoard[x][y] === 'O') return false;
        return true;
    }

    // A* Heuristic: Sum of Manhattan distances from each piece to its nearest target
    calculateHeuristic(board) {
        let pieces = [];
        let targets = [];

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (board[r][c] === 'O') pieces.push({ r, c });
                if (this.staticBoard[r][c] === 'x') targets.push({ r, c });
            }
        }

        let totalDistance = 0;
        for (let p of pieces) {
            let minD = Infinity;
            for (let t of targets) {
                let d = Math.abs(p.r - t.r) + Math.abs(p.c - t.c);
                if (d < minD) minD = d;
            }
            totalDistance += minD;
        }
        return totalDistance;
    }

    async solve(maxSteps = 100, progressCallback = null, timeoutMs = 30000) {
        // Use MinHeap for efficient priority queue (O(log N) instead of O(N))
        // Tie-breaker: when scores are equal, prefer nodes with lower cost (g-value)
        const openSet = new MinHeap((a, b) => {
            if (a.score !== b.score) return a.score - b.score;
            return a.cost - b.cost; // Tie-breaker: prefer lower cost
        });
        const closedSet = new Set(); // States we've already explored
        const gScore = new Map(); // hash -> best known cost to reach this state

        const initialH = this.calculateHeuristic(this.initialDynamicBoard);
        const initialHash = this.serialize(this.initialDynamicBoard);
        
        openSet.insert({
            state: this.initialDynamicBoard,
            path: "",
            hash: initialHash,
            cost: 0,
            heuristic: initialH,
            score: 0 + initialH
        });

        gScore.set(initialHash, 0);

        let iterations = 0;
        const maxIterations = 2000000;
        const startTime = Date.now();
        let cancelled = false;

        // Global cancel flag
        window.solverCancelled = false;

        while (openSet.size() > 0) {
            iterations++;
            
            // Check for cancellation
            if (window.solverCancelled) {
                cancelled = true;
                break;
            }

            // Check timeout
            const elapsed = Date.now() - startTime;
            if (elapsed > timeoutMs) {
                console.log(`Timeout after ${elapsed}ms`);
                if (progressCallback) {
                    progressCallback({ 
                        iterations, 
                        nodes: openSet.size(), 
                        elapsed, 
                        status: 'timeout' 
                    });
                }
                return null;
            }

            // Check max iterations
            if (iterations > maxIterations) {
                console.log("Max iterations reached");
                if (progressCallback) {
                    progressCallback({ 
                        iterations, 
                        nodes: openSet.size(), 
                        elapsed, 
                        status: 'max_iterations' 
                    });
                }
                return null;
            }

            // Yield to UI more frequently (every 500 iterations instead of 2000)
            if (iterations % 500 === 0) {
                if (progressCallback) {
                    progressCallback({ 
                        iterations, 
                        nodes: openSet.size(), 
                        elapsed, 
                        status: 'running' 
                    });
                }
                await new Promise(resolve => setTimeout(resolve, 0));
            }

            // Extract minimum from heap (O(log N))
            const current = openSet.extractMin();

            // Skip if already in closed set
            if (closedSet.has(current.hash)) {
                continue;
            }

            // Add to closed set
            closedSet.add(current.hash);

            if (this.isWinBoard(current.state)) {
                if (progressCallback) {
                    progressCallback({ 
                        iterations, 
                        nodes: openSet.size(), 
                        elapsed, 
                        status: 'solved' 
                    });
                }
                return current.path;
            }

            // Prune if path gets too long
            if (current.path.length >= maxSteps) {
                continue;
            }

            for (let moveKey of ['U', 'D', 'L', 'R']) {
                const res = this.applyMove(current.state, moveKey);
                if (res.changed) {
                    const newHash = this.serialize(res.board);
                    const newCost = current.cost + 1;

                    // Skip if already in closed set
                    if (closedSet.has(newHash)) {
                        continue;
                    }

                    // Only add if we haven't seen this state or found a better path
                    if (!gScore.has(newHash) || newCost < gScore.get(newHash)) {
                        gScore.set(newHash, newCost);
                        const h = this.calculateHeuristic(res.board);
                        openSet.insert({
                            state: res.board,
                            path: current.path + moveKey,
                            hash: newHash,
                            cost: newCost,
                            heuristic: h,
                            score: newCost + h
                        });
                    }
                }
            }
        }

        if (cancelled) {
            if (progressCallback) {
                progressCallback({ 
                    iterations, 
                    nodes: 0, 
                    elapsed: Date.now() - startTime, 
                    status: 'cancelled' 
                });
            }
        }

        return null;
    }
}

// Global hook
window.GameSolver = Solver;
