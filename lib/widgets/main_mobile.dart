import 'package:flutter/material.dart';

import '../constants/colors.dart';
import '../constants/images.dart';

class MainMobile extends StatelessWidget {
  const MainMobile({super.key});

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    final screenHeight = screenSize.height;
    return Container(
      margin:
      const EdgeInsets.symmetric(horizontal: 40.0, vertical: 30.0),
      height: screenHeight/2.5,
      constraints: const BoxConstraints(
        minHeight: 560.0,
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          //avatar img
          ShaderMask(
            shaderCallback: (Rect bounds) {
              return LinearGradient(
                colors: [
                  CustomColor.scaffoldBg.withOpacity(0.6),
                  CustomColor.scaffoldBg.withOpacity(0.6)
                ],
              ).createShader(bounds);
            },
            blendMode: BlendMode.srcATop,
            child: Image.asset(
              dash,
              width: screenWidth,
            ),
          ),

          const SizedBox(
            height: 30,
          ),

          //intro text
          const Text(
            "Hi \nI'm Axel Asa\nA Mobile Developer",
            style: TextStyle(
                fontSize: 24,
                height: 1.5,
                fontWeight: FontWeight.bold,
                color: CustomColor.whitePrimary),
          ),
          const SizedBox(
            height: 15,
          ),
          //btn
          SizedBox(
            width: 200,
            child: ElevatedButton(
              onPressed: () {},
              style: const ButtonStyle(
                  backgroundColor: WidgetStatePropertyAll<Color>(
                      CustomColor.yellowPrimary)),
              child: const Text("Get in touch",
                  style: TextStyle(color: CustomColor.whitePrimary)),
            ),
          )
        ],
      ),
    );
  }
}
