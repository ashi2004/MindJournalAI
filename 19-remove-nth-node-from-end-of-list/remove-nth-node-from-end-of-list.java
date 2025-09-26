/**
 * Definition for singly-linked list.
 * public class ListNode {
 *     int val;
 *     ListNode next;
 *     ListNode() {}
 *     ListNode(int val) { this.val = val; }
 *     ListNode(int val, ListNode next) { this.val = val; this.next = next; }
 * }
 */
class Solution {
    public ListNode removeNthFromEnd(ListNode head, int n) {
        ListNode temp=head;
        int sz=0;
        while(temp!=null){
            temp=temp.next;
            sz++;
        }
        if(sz==n){
            ListNode newhead=head.next;
            // head=null;
            return newhead;
        }
        ListNode curr=head;
        int i=1;
        while(i<sz-n){
          curr=curr.next;
          i++;
        }
        ListNode del=curr.next;
        curr.next=curr.next.next;
        del=null;
        return head;
        
        
        
    }
}