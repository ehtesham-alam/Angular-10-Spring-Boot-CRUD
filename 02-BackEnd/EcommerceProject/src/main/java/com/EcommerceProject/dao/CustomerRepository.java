package com.EcommerceProject.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import com.EcommerceProject.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{

}
