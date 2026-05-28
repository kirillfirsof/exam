package com.example.demo.security;

import java.util.Date;

import javax.crypto.SecretKey;


import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    private static final String SECRET = "11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111";

    private static final long EXPIRATION = 86400000;


    private SecretKey getSigningKey(){
        byte[] keyBytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(SECRET.getBytes()));
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(getSigningKey())
                .compact();
    }


    public String getUsernameFromToken(String token){
        return getClaims(token).getSubject();
    }


    public boolean validateToken(String token){
        try {
            getClaims(token);
            return true;
        } catch(JwtException e) {
            return false;
        }
    }



    private Claims getClaims(String token){
        return Jwts.parser()
        .verifyWith(getSigningKey())
        .build()
        .parseSignedClaims(token)
        .getPayload();
    }

    
}
