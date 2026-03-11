class ReceiptModel {
  final String id;
  final String userId;
  final String invoiceId;
  final String receiptNumber;
  final double amount;
  final String paymentMethod;
  final DateTime date;
  final DateTime createdAt;

  ReceiptModel({
    required this.id,
    required this.userId,
    required this.invoiceId,
    required this.receiptNumber,
    required this.amount,
    required this.paymentMethod,
    required this.date,
    required this.createdAt,
  });

  factory ReceiptModel.fromJson(Map<String, dynamic> json) {
    return ReceiptModel(
      id: json['id'] ?? json['_id'],
      userId: json['userId'],
      invoiceId: json['invoiceId'],
      receiptNumber: json['receiptNumber'],
      amount: (json['amount'] ?? 0).toDouble(),
      paymentMethod: json['paymentMethod'],
      date: DateTime.parse(json['date']),
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'invoiceId': invoiceId,
      'receiptNumber': receiptNumber,
      'amount': amount,
      'paymentMethod': paymentMethod,
      'date': date.toIso8601String(),
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
