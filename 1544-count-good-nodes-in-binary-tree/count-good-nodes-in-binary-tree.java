/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode() {}
 *     TreeNode(int val) { this.val = val; }
 *     TreeNode(int val, TreeNode left, TreeNode right) {
 *         this.val = val;
 *         this.left = left;
 *         this.right = right;
 *     }
 * }
 */
class Solution {
    class Pair{
        TreeNode node;
        int val;
        Pair(TreeNode node,int val){
            this.node=node;
            this.val=val;
        }
    }
    public int goodNodes(TreeNode root) {
        Queue<Pair>q=new LinkedList<>();
        q.add(new Pair(root,Integer.MIN_VALUE));
        
        int cnt=0;
        int max=root.val;
        while(!q.isEmpty()){
          TreeNode node=q.peek().node;
          int maxval=q.peek().val;
          q.poll();
          if(node.val>=maxval){
            cnt++;
          }
          if(node.left!=null){
            q.add(new Pair(node.left,Math.max(node.val,maxval)));
          }
           if(node.right!=null){
            q.add(new Pair(node.right,Math.max(node.val,maxval)));
          }
        }
        return cnt;
    }
}