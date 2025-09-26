/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode(int x) {
 *         val = x;
 *         next = null;
 *     }
 * }
 */
public class Solution {
    public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
        // HashSet<ListNode>set=new HashSet<>();
        // while(headA!=null){
        //     set.add(headA);
        //     headA=headA.next;
        // }
        // while(headB!=null){
        //  if(set.contains(headB)){
        //     return headB;
        //  }
        //  set.add(headB);
        //  headB=headB.next;

        // }
        // return null;

        ListNode currA=headA;
        ListNode currB=headB;
        while(currA!=currB){
            currA=currA==null?headB:currA.next;
            currB=currB==null?headA:currB.next;

        }
        return currA;
    }
}