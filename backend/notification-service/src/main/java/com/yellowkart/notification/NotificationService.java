package com.yellowkart.notification;

import com.yellowkart.notification.logging.Logged;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.inject.Inject;
import jakarta.inject.Singleton;
import com.yellowkart.notification.logging.YkTrace;

@Singleton
@Logged
public class NotificationService {

    @Inject
    Mailer mailer;

    public void sendOrderConfirmation(String email, String orderNumber) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("NotificationService", "sendOrderConfirmation")) {
            Mail mail = new Mail().setFrom("noreply@yellowkart.com").setTo(email).setSubject("Order Confirmation - " + orderNumber).setText("Your order " + orderNumber + " has been confirmed.");
            mailer.send(mail);
        }
    }

    public void sendShippingNotification(String email, String orderNumber, String trackingId) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("NotificationService", "sendShippingNotification")) {
            Mail mail = new Mail().setFrom("noreply@yellowkart.com").setTo(email).setSubject("Order Shipped - " + orderNumber).setText("Your order " + orderNumber + " has been shipped. Tracking ID: " + trackingId);
            mailer.send(mail);
        }
    }

    public void sendDeliveryNotification(String email, String orderNumber) {
        try (YkTrace.Scope __ykMethod = YkTrace.method("NotificationService", "sendDeliveryNotification")) {
            Mail mail = new Mail().setFrom("noreply@yellowkart.com").setTo(email).setSubject("Order Delivered - " + orderNumber).setText("Your order " + orderNumber + " has been delivered.");
            mailer.send(mail);
        }
    }
}
