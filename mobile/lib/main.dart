import 'package:flutter/material.dart';

void main() {
  runApp(const ZapaApp());
}

class ZapaApp extends StatelessWidget {
  const ZapaApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Zapa',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF22C55E), // Primary green from architecture
          primary: const Color(0xFF22C55E),
          secondary: const Color(0xFF16A34A),
          surface: const Color(0xFFF0FDF4),
        ),
        useMaterial3: true,
      ),
      home: const Scaffold(
        body: Center(
          child: Text('Welcome to Zapa'),
        ),
      ),
    );
  }
}
