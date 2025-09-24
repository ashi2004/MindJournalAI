class Solution {
    public String fractionToDecimal(int numerator, int denominator) {
       if (numerator == 0) return "0";
        
        StringBuilder sb = new StringBuilder();
        
        // Handle sign
        if ((numerator < 0) ^ (denominator < 0)) {
            sb.append("-");
        }
        
        // Convert to long to prevent overflow (like -2147483648 / -1)
        long num = Math.abs((long) numerator);
        long den = Math.abs((long) denominator);
        
        // Integer part
        sb.append(num / den);
        long remainder = num % den;
        if (remainder == 0) return sb.toString();
        
        sb.append(".");
        
        // Map remainder → index in result string
        Map<Long, Integer> map = new HashMap<>();
        
        while (remainder != 0) {
            if (map.containsKey(remainder)) {
                int start = map.get(remainder);
                sb.insert(start, "(");
                sb.append(")");
                break;
            }
            
            map.put(remainder, sb.length());
            remainder *= 10;
            sb.append(remainder / den);
            remainder %= den;
        }
        
        return sb.toString();

    }
}