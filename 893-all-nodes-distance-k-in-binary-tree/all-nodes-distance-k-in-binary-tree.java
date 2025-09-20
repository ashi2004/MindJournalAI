/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */
class Solution {

    // Custom Pair class
    static class Pair {
        TreeNode node;
        int dist;
        Pair(TreeNode node, int dist) {
            this.node = node;
            this.dist = dist;
        }
    }

    // Step 1: Build parent map using BFS
    private void buildParent(TreeNode root, Map<TreeNode, TreeNode> parent) {
        Queue<TreeNode> q = new LinkedList<>();
        q.add(root);
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            if (node.left != null) {
                parent.put(node.left, node);
                q.add(node.left);
            }
            if (node.right != null) {
                parent.put(node.right, node);
                q.add(node.right);
            }
        }
    }

    public List<Integer> distanceK(TreeNode root, TreeNode target, int k) {
        Map<TreeNode, TreeNode> parent = new HashMap<>();
        buildParent(root, parent);

        List<Integer> result = new ArrayList<>();
        Set<TreeNode> visited = new HashSet<>();

        // Queue will store Pair(node, distance)
        Queue<Pair> q = new LinkedList<>();
        q.add(new Pair(target, 0));
        visited.add(target);

        while (!q.isEmpty()) {
            Pair p = q.poll();
            TreeNode node = p.node;
            int dist = p.dist;

            if (dist == k) {
                result.add(node.val);
                // don’t expand further if we already reached distance k
              
            }

            // Explore neighbors
            if (node.left != null && !visited.contains(node.left)) {
                q.add(new Pair(node.left, dist + 1));
                visited.add(node.left);
            }
            if (node.right != null && !visited.contains(node.right)) {
                q.add(new Pair(node.right, dist + 1));
                visited.add(node.right);
            }
            if (parent.containsKey(node) && !visited.contains(parent.get(node))) {
                q.add(new Pair(parent.get(node), dist + 1));
                visited.add(parent.get(node));
            }
        }

        return result;
    }
}
