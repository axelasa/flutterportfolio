import 'package:flutter/material.dart';

import '../constants/colors.dart';
import '../constants/images.dart';

class MainDesktop extends StatelessWidget {
  const MainDesktop({super.key});


  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    final screenHeight = screenSize.height;

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 20),
      height: screenHeight / 1.5,
      constraints: const BoxConstraints(minHeight: 350),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              //intro message
              const Text(
                "Hi \nI'm Axel Asa\nA Flutter Developer",
                style: TextStyle(
                    fontSize: 30,
                    height: 1.5,
                    fontWeight: FontWeight.bold,
                    color: CustomColor.whitePrimary),
              ),
              const SizedBox(
                height: 15,
              ),
              SizedBox(
                width: 250,
                child: ElevatedButton(
                  onPressed: () {},
                  style: const ButtonStyle(
                      backgroundColor: WidgetStatePropertyAll<Color>(CustomColor.yellowPrimary)
                  ),
                  child:  const Text("Get in touch",
                      style: TextStyle(
                          color: CustomColor.whitePrimary
                      )
                  ),
                ),
              )
            ],
          ),
          Image.asset(
            dash,
            width: screenWidth / 2,
          ),
        ],
      ),
    );
  }
}
