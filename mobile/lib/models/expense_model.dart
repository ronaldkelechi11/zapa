class ExpenseModel {
  final String id;
  final String userId;
  final String businessId;
  final String name;
  final String category;
  final double amount;
  final DateTime date;
  final String? receiptImage;
  final DateTime createdAt;

  ExpenseModel({
    required this.id,
    required this.userId,
    required this.businessId,
    required this.name,
    required this.category,
    required this.amount,
    required this.date,
    this.receiptImage,
    required this.createdAt,
  });

  factory ExpenseModel.fromJson(Map<String, dynamic> json) {
    return ExpenseModel(
      id: json['id'] ?? json['_id'],
      userId: json['userId'],
      businessId: json['businessId'],
      name: json['name'],
      category: json['category'],
      amount: (json['amount'] ?? 0).toDouble(),
      date: DateTime.parse(json['date']),
      receiptImage: json['receiptImage'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'businessId': businessId,
      'name': name,
      'category': category,
      'amount': amount,
      'date': date.toIso8601String(),
      'receiptImage': receiptImage,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
