package com.example.coldwatefishproject.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter @Setter
@Table(name = "member_account")
public class Member {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  /*DB가 ID를 자동으로 1 증가 */
    private Long id;

    @Column(name = "login_id", unique = true)  // DB의 login_id 컬럼과 매핑, 중복 방지 설정
    private String username;

    @Column(name = "password") // DB의 password 컬럼과 매핑
    private String password;

    @Column(name = "username") // DB에는 username이라 적혀있지만, 자바에선 nickname으로 부름
    private String nickname;

    @Column(name = "phone")
    private String phone;   //연락처 컬럼

    @Column(name = "role")  // 사용자 권한 (예: ROLE_USER, ROLE_ADMIN)
    private String role;


    /* MariaDB의 'email'이라는 이름의 컬럼과 이 변수를 연결합니다. */
    //

    @Column(name = "email")
    private String email;  // 이메일 컬럼

// 회원의 이메일 주소를 저장하는 비밀 변수

    public String getEmail() {
        return email;
    }
    // 현재 저장된 이메일 값을 반환합니다.


    /* 외부에서 이메일 값을 새로 저장하거나 변경할 때 사용하는 통로입니다. */
    public void setEmail(String email) {
        this.email = email;
    }

// 전달받은 새 이메일 값을 변수에 저장합니다.

}

