package com.EcommerceProject.service;

import com.EcommerceProject.dto.Purchase;
import com.EcommerceProject.dto.PurchaseResponse;

public interface CheckoutService {
	
	PurchaseResponse placeOrder(Purchase purchase);
	
}
