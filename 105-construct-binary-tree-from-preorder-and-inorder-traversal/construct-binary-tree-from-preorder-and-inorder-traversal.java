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
    public TreeNode f(int preorder[],int prestart,int prend,int inorder[],int instart,int inend, Map<Integer,Integer>map){
       if(prestart>prend || instart>inend){
        return null;
       }
        TreeNode root=new TreeNode(preorder[prestart]);
        int inroot=map.get(root.val);
        int numsleft=inroot-instart;
        root.left=f(preorder,prestart+1,prestart+numsleft,inorder,instart,inroot-1,map);
        root.right=f(preorder,prestart+numsleft+1,prend,inorder,inroot+1,inend,map);
        return root;
    }
    public TreeNode buildTree(int[] preorder, int[] inorder) {
        Map<Integer,Integer>map=new HashMap<>();
        for(int i=0;i<inorder.length;i++){
            map.put(inorder[i],i);
        }
      
      return  f(preorder,0,preorder.length-1,inorder,0,inorder.length-1,map);
    }
}