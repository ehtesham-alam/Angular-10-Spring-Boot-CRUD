package com.EcommerceProject.service;

import java.util.Set;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.EcommerceProject.dao.CustomerRepository;
import com.EcommerceProject.dto.Purchase;
import com.EcommerceProject.dto.PurchaseResponse;
import com.EcommerceProject.entity.Customer;
import com.EcommerceProject.entity.Order;
import com.EcommerceProject.entity.OrderItem;

import jakarta.transaction.Transactional;

@Service
public class CheckoutServiceImpl implements CheckoutService{
	
	
	private CustomerRepository customerRepository;
	
	public CheckoutServiceImpl(CustomerRepository customerRepository) {
		this.customerRepository = customerRepository;
	}

	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {
	
		//retrive the order info from dto
		Order order = purchase.getOrder();
			
		// generate tracking number
		String orderTrackingNumber =generateOrderTrackNumber();
		order.setOrderTrackingNumber(orderTrackingNumber);
		
		//populate order with orderItems
		Set<OrderItem> orderItems = purchase.getOrderItems();
		orderItems.forEach(Item -> order.add(Item));
		
		//populate order with billingAddress AND shippingAddress
		order.setBillingAddress(purchase.getBillingAddress());
		order.setShippingAddress(purchase.getShippingAddress());
		
		//populate customer with order
		Customer customer = purchase.getCustomer();
		customer.add(order);
		
		//save to the database
		customerRepository.save(customer);
		
		//return a response
		return new PurchaseResponse(orderTrackingNumber);
	}

	private  String generateOrderTrackNumber() {
		
		//generate the random uuid number(uuid version-4)
		//for detail see: http://en.wikepedia.org.wiki
		
		return UUID.randomUUID().toString();
		
	
	}

}
