//package org.expensetracker.service;
//
//import io.jsonwebtoken.Claims;
//import io.jsonwebtoken.Jwts;
//import io.jsonwebtoken.io.Decoders;
//import io.jsonwebtoken.security.Keys;
//import org.springframework.stereotype.Service;
//
//import java.security.Key;
//import java.util.function.Function;
//
//@Service
//public class JwtService {
//
//    private static final String SECRET_KEY = "e5a0c83d370a33b3218e1b1ffe2ed0d772965da2ac4a6f6d89a616893d4445d3";
//
//    public String extractUsername(String token) {
//        return null;
//    }
//
////    public <T> T extractClaims(String token, Function<Claims,T> claimsResolver){
////        final Claims claims = extractAllClaims(token);
////        claimsResolver.apply(claims);
////    }
//
//    private Claims extractAllClaims(String token){
//        return Jwts
//                .parserBuilder()
//                .setSigningKey(getSignInKey())
//                .build()
//                .parseClaimsJws(token)
//                .getBody();
//    }
//
//    private Key getSignInKey() {
//        byte[] keyBytes = Decoders.BASE64URL.decode((SECRET_KEY));
//        return Keys.hmacShaKeyFor(keyBytes);
//    }
//
//}
