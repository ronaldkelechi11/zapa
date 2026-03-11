class UserModel {
  final String id;
  final String firebaseUid;
  final String email;
  final String? name;
  final String plan;
  final DateTime createdAt;

  UserModel({
    required this.id,
    required this.firebaseUid,
    required this.email,
    this.name,
    required this.plan,
    required this.createdAt,
  });

  factory UserModel.fromJson(Map<String, dynamic> json) {
    return UserModel(
      id: json['id'] ?? json['_id'],
      firebaseUid: json['firebaseUid'],
      email: json['email'],
      name: json['name'],
      plan: json['plan'] ?? 'free',
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firebaseUid': firebaseUid,
      'email': email,
      'name': name,
      'plan': plan,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
