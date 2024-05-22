import 'package:flutter/material.dart';
import 'package:portfolio/constants/colors.dart';
import 'package:portfolio/constants/size.dart';
import 'package:portfolio/widgets/drawer_mobile.dart';
import 'package:portfolio/widgets/footer.dart';
import 'package:portfolio/widgets/header_desktop.dart';
import 'package:portfolio/widgets/header_mobile.dart';
import 'package:portfolio/widgets/main_mobile.dart';
import 'package:portfolio/widgets/skills_desktop.dart';
import '../widgets/contact_section.dart';
import '../widgets/main_desktop.dart';
import '../widgets/projects_section.dart';
import '../widgets/skills_mobile.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  final scaffoldKey = GlobalKey<ScaffoldState>();
  final scrollController = ScrollController();
  final List<GlobalKey>navbarKeys = List.generate(4, (index)=>GlobalKey());

  @override
  Widget build(BuildContext context) {
    final screenSize = MediaQuery.of(context).size;
    final screenWidth = screenSize.width;
    return LayoutBuilder(builder: (context, constraints) {
      return Scaffold(
        key: scaffoldKey,
        backgroundColor: CustomColor.scaffoldBg,
        endDrawer: constraints.maxWidth >= minDesktopWidth
            ? null
            :  DrawerMobile(onNavItemTap:(int navIndex) {
              //close drawer
          scaffoldKey.currentState?.closeEndDrawer();
              //call func
          scrollToSection(navIndex);
        },),
        body: SingleChildScrollView(
          controller: scrollController,
          scrollDirection: Axis.vertical,
          child: Column(
            //scrollDirection: Axis.vertical,
            children: [
              SizedBox(key: navbarKeys.first,),
              //Header
              constraints.maxWidth >= minDesktopWidth
                  ?  HeaderDesktop(onNavMenuTap:(int navIndex){
                scrollToSection(navIndex);
              },)
                  : HeaderMobile(
                      onLogoTap: () {},
                      onMenuTap: () {
                        scaffoldKey.currentState?.openEndDrawer();
                      },
                    ),
              constraints.maxWidth >= minDesktopWidth
              ?const MainDesktop()
              :const MainMobile(),
          
              //Skills
              Container(
                key: navbarKeys[1],
                width: screenWidth,
                color: CustomColor.bgLight1,
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 30.0),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      //title
                      const Text(
                        "what I can do",
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                          color: CustomColor.whitePrimary,
                        ),
                      ),
          
                      const SizedBox(
                        height: 55,
                      ),
                      //platforms & skills
                      constraints.maxWidth >=mediumDesktopWidth
                      ?const SkillsDesktop()
                      :const SkillsMobile(),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 30,),
              //PROJECT
               ProjectsSection(key: navbarKeys[2],),
              //contact
               ContactSection(key: navbarKeys[3]),
              //Footer
              const Footer(),
            ],
          ),
        ),
      );
    },);
  }
  void scrollToSection(int navIndex){
    final key = navbarKeys[navIndex];
    Scrollable.ensureVisible(
      key.currentContext!,
      duration: const Duration(milliseconds: 500),
      curve: Curves.easeInOut,
    );
  }
}

//


