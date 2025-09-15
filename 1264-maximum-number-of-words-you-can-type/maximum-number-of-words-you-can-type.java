class Solution {
    public int canBeTypedWords(String text, String brokenLetters) {
       String[] parts = text.split(" ");
       Set<Character>set=new HashSet<>();
       for(int i=0;i<brokenLetters.length();i++){
        set.add(brokenLetters.charAt(i));
       }
       int cnt=0;
       for(String word:parts){
        for(int i=0;i<word.length();i++){
            if(set.contains(word.charAt(i))){
                cnt++;
                break;
            }
        }
       }
       return parts.length-cnt;
    }
}