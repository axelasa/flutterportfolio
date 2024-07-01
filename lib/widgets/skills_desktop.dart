import 'package:flutter/material.dart';

import '../constants/colors.dart';
import '../constants/skill_items.dart';

class SkillsDesktop extends StatelessWidget {
  const SkillsDesktop({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment:MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        //platforms
        ConstrainedBox(
          constraints: const BoxConstraints(
              maxWidth: 450
          ),
          child: Wrap(
            spacing: 5,
            runSpacing: 5,
            children: [
              for(int i=0; i<platformItems.length; i++)
                Container(
                  width: 200,
                  decoration:BoxDecoration(
                    color: CustomColor.bgLight2,
                    borderRadius: BorderRadius.circular(5),
                  ) ,
                  child: ListTile(
                    contentPadding: const EdgeInsets.symmetric(horizontal: 20,vertical: 10),
                    leading: Image.asset(platformItems[i]['img'],width: 26,),
                    title: Text(platformItems[i]['title']),
                  ),
                ),
            ],
          ),
        ),
        const SizedBox(width: 50,),
        //skills
        Flexible(
          child: ConstrainedBox(
            constraints: const BoxConstraints(
                maxWidth: 500
            ),
            child: Wrap(
              spacing: 10.0,
              runSpacing: 10.0,
              children: [
                for(int i=0; i<skillsItems.length; i++)
                  Chip(
                    padding: const EdgeInsets.symmetric(vertical: 12.0,horizontal: 16.0),
                    label: Text(skillsItems[i]['title'],),
                    avatar: Image.asset(skillsItems[i]['img'],),
                    backgroundColor: CustomColor.bgLight2,
                  )
              ],
            ),
          ),
        )
      ],
    );
  }
}
