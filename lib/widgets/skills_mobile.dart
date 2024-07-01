import 'package:flutter/material.dart';

import '../constants/colors.dart';
import '../constants/skill_items.dart';
class SkillsMobile extends StatelessWidget {
  const SkillsMobile({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 60.0),
      child: ConstrainedBox(
        constraints:const  BoxConstraints(
          maxWidth: 500,
        ),
        child: Column(
          children: [
            //platforms
            for(int i=0; i<platformItems.length; i++)
              Container(
                margin: const EdgeInsets.only(bottom: 5.0),
                width: double.maxFinite,
                decoration: BoxDecoration(
                  color: CustomColor.bgLight2,
                  borderRadius: BorderRadius.circular(5.0),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal:20 ,vertical:10.0 ,),
                  leading: Image.asset(platformItems[i]['img'],width: 26,),
                  title: Text(platformItems[i]['title']),
                ),
              ),
            const SizedBox(height: 50,),
            //skills
            Wrap(
              spacing: 10.0,
              runSpacing: 10.0,
              alignment: WrapAlignment.center,
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
          ],
        ),
      ),
    );
  }
}
