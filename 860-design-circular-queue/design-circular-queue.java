class MyCircularQueue {
     List<Integer>q;
     int cap;
    public MyCircularQueue(int k) {
        q=new ArrayList<>();
        cap=k;
    }
    
    public boolean enQueue(int value) {
        if(q.size()<cap){
            q.add(value);
        }else{
            return false;
        }
        return true;
    }
    
    public boolean deQueue() {
        if(q.isEmpty()){
            return false;
        }
        q.remove(0);
        return true;
        
    }
    
    public int Front() {
     if(!q.isEmpty()){
        return q.get(0);
     }
     return -1;
    }
    
    public int Rear() {
     if(!q.isEmpty()){
        return q.get(q.size()-1);
     }
     return -1;
    }
    
    public boolean isEmpty() {
        if(q.size()==0){
            return true;
        }
        return false;
    }
    
    public boolean isFull() {
        if(q.size()==cap){
            return true;
        }
        return false;
    }
}

/**
 * Your MyCircularQueue object will be instantiated and called as such:
 * MyCircularQueue obj = new MyCircularQueue(k);
 * boolean param_1 = obj.enQueue(value);
 * boolean param_2 = obj.deQueue();
 * int param_3 = obj.Front();
 * int param_4 = obj.Rear();
 * boolean param_5 = obj.isEmpty();
 * boolean param_6 = obj.isFull();
 */