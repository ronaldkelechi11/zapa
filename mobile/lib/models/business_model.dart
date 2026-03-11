class BusinessModel {
  final String id;
  final String userId;
  final String name;
  final String? logo;
  final String? phone;
  final String? email;
  final String? address;
  final String currency;
  final double taxRate;
  final DateTime createdAt;

  BusinessModel({
    required this.id,
    required this.userId,
    required this.name,
    this.logo,
    this.phone,
    this.email,
    this.address,
    required this.currency,
    required this.taxRate,
    required this.createdAt,
  });

  factory BusinessModel.fromJson(Map<String, dynamic> json) {
    return BusinessModel(
      id: json['id'] ?? json['_id'],
      userId: json['userId'],
      name: json['name'],
      logo: json['logo'],
      phone: json['phone'],
      email: json['email'],
      address: json['address'],
      currency: json['currency'] ?? 'USD',
      taxRate: (json['taxRate'] ?? 0).toDouble(),
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'name': name,
      'logo': logo,
      'phone': phone,
      'email': email,
      'address': address,
      'currency': currency,
      'taxRate': taxRate,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
