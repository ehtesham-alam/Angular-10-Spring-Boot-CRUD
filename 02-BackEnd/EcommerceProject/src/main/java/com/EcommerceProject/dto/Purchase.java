package com.EcommerceProject.dto;

import java.util.Set;

import com.EcommerceProject.entity.Address;
import com.EcommerceProject.entity.Customer;
import com.EcommerceProject.entity.Order;
import com.EcommerceProject.entity.OrderItem;

import lombok.Data;


@Data
public class Purchase {
	
	private Customer customer;
	private Address shippingAddress;
	private Address billingAddress;
	private Order order;
	private Set<OrderItem> orderItems;
	
	
}
