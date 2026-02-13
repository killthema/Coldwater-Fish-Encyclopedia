package com.example.coldwatefishproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration // "이것은 설정 파일입니다"라는 명찰
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 모든 주소로 들어오는 요청에 대해
                .allowedOrigins("http://localhost:5173") //  리액트(5173)의 접속을 허락한다!
                .allowedMethods("GET", "POST", "PUT", "DELETE") // 이 방식들을 허용한다
                .allowCredentials(true); // 로그인 정보(쿠키 등)도 통과시켜준다
    }
}