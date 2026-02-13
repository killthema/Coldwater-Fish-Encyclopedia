/**
 * [파일의 역할]
 * 리액트(5173)와 스프링 부트(8090) 사이의 보안 장벽을 완전히 허물어주는 '마스터키'입니다.
 */
package com.example.coldwatefishproject.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * [수정 포인트]
     * localhost의 모든 포트(*)에서 오는 요청을 허용하도록 '마스터키'를 만듭니다. [cite: 2026-01-06]
     */
    /**
     * [파일의 역할]
     * 리액트 포트 번호가 5173, 5174, 5175 중 무엇이든 상관없이
     * 보안 문(CORS)을 열어주는 마스터 설정입니다. [cite: 2026-01-06]
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // [중요] .allowedOrigins 대신 Patterns를 써서 모든 포트를 허용합니다.
                .allowedOriginPatterns("http://localhost:*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}