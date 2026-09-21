package com.example.TechBridge.Entity;
import com.fasterxml.jackson.annotation.JsonProperty;

public class Payment {

    // Matches data.orderId in OrderSummary.jsx
    @JsonProperty("orderId")
    private String orderId;

    @JsonProperty("currency")
    private String currency;

    @JsonProperty("amount")
    private int amount;

    // Matches data.key in OrderSummary.jsx
    @JsonProperty("key")
    private String key;

    public Payment() {}

    public Payment(String orderId, String currency, int amount, String key) {
        this.orderId = orderId;
        this.currency = currency;
        this.amount = amount;
        this.key = key;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }
}