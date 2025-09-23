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
    public TreeNode findLastRight(TreeNode root){
        while(root.right!=null){
            root=root.right;
        }
        return root;
    }
    public TreeNode helper(TreeNode root){
    if(root.left==null){
        return root.right;
    }
    if(root.right==null){
        return root.left;
    }
    TreeNode rightchild=root.right;
    TreeNode lastright=findLastRight(root.left);
    lastright.right=rightchild;
    return root.left;
    }
    public TreeNode deleteNode(TreeNode root, int key) {
        if(root==null){
            return null;
        }
        if(root.val==key){
            return helper(root);
        }
        TreeNode node=root;
        while(node!=null){
            if(node.val>key){
               if(node.left!=null && node.left.val==key){
                node.left=helper(node.left);
                break;
               }else{
                node=node.left;
               }
            }
            else{
               if(node.right!=null && node.right.val==key){
                node.right=helper(node.right);
                break;
               }else{
                node=node.right;
               }
            }

            
        }

        return root;

    }
}