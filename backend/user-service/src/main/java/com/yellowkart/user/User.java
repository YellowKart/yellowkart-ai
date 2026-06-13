package com.yellowkart.user;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User extends PanacheEntity {
    public String firstName;
    public String lastName;
    public String email;
    public String password;
    public String phone;
    public String address;
    public String city;
    public String state;
    public String zipCode;
    public String country;
    public boolean active;
    public LocalDateTime createdAt;
    public LocalDateTime updatedAt;

    public User() {
    }

    public User(String firstName, String lastName, String email, String phone) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.active = true;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
}
