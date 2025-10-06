import java.util.*;

class DisjointSet {
    int[] parent;
    int[] size;

    public DisjointSet(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
    }

    public int findUPar(int x) {
        if (x == parent[x]) return x;
        return parent[x] = findUPar(parent[x]);
    }

    public void unionBySize(int u, int v) {
        int pu = findUPar(u);
        int pv = findUPar(v);
        if (pu == pv) return;
        if (size[pu] < size[pv]) {
            parent[pu] = pv;
            size[pv] += size[pu];
        } else {
            parent[pv] = pu;
            size[pu] += size[pv];
        }
    }
}

class Solution {
    int[][] dir = {{-1,0},{1,0},{0,-1},{0,1}};
    
    public int swimInWater(int[][] grid) {
        int n = grid.length;
        int total = n * n;
        int[][] cellList = new int[total][3]; // [elevation, row, col]
        
        for (int i = 0; i < n; i++)
            for (int j = 0; j < n; j++)
                cellList[i * n + j] = new int[]{grid[i][j], i, j};
        
        Arrays.sort(cellList, Comparator.comparingInt(a -> a[0]));

        DisjointSet ds = new DisjointSet(n * n);
        boolean[][] visited = new boolean[n][n];
        
        for (int i = 0; i < total; i++) {
            int t = cellList[i][0], r = cellList[i][1], c = cellList[i][2];
            visited[r][c] = true;
            int curr = r * n + c;

            for (int[] d : dir) {
                int nr = r + d[0], nc = c + d[1];
                if (nr >= 0 && nr < n && nc >= 0 && nc < n && visited[nr][nc]) {
                    int neighbor = nr * n + nc;
                    ds.unionBySize(curr, neighbor);
                }
            }

            if (ds.findUPar(0) == ds.findUPar(n * n - 1)) {
                return t;
            }
        }
        return -1;
    }
}