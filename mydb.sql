/*
 Navicat MySQL Dump SQL

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 80011 (8.0.11)
 Source Host           : localhost:3306
 Source Schema         : mydb

 Target Server Type    : MySQL
 Target Server Version : 80011 (8.0.11)
 File Encoding         : 65001

 Date: 31/08/2024 15:16:56
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for character_modules
-- ----------------------------
DROP TABLE IF EXISTS `character_modules`;
CREATE TABLE `character_modules`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `character_id` int(11) NOT NULL,
  `module_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_character_modules_moduleid`(`module_id` ASC) USING BTREE,
  INDEX `idx_character_modules_characterid`(`character_id` ASC) USING BTREE,
  CONSTRAINT `fk_character_modules_characterid` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_character_modules_moduleid` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 97 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of character_modules
-- ----------------------------
INSERT INTO `character_modules` VALUES (1, 1, 1);
INSERT INTO `character_modules` VALUES (2, 1, 2);
INSERT INTO `character_modules` VALUES (3, 1, 3);
INSERT INTO `character_modules` VALUES (4, 1, 4);
INSERT INTO `character_modules` VALUES (5, 1, 5);
INSERT INTO `character_modules` VALUES (6, 1, 6);
INSERT INTO `character_modules` VALUES (7, 1, 7);
INSERT INTO `character_modules` VALUES (8, 1, 8);
INSERT INTO `character_modules` VALUES (9, 1, 9);
INSERT INTO `character_modules` VALUES (10, 1, 10);
INSERT INTO `character_modules` VALUES (12, 1, 12);
INSERT INTO `character_modules` VALUES (13, 2, 1);
INSERT INTO `character_modules` VALUES (14, 2, 4);
INSERT INTO `character_modules` VALUES (15, 2, 9);
INSERT INTO `character_modules` VALUES (16, 2, 10);
INSERT INTO `character_modules` VALUES (18, 2, 12);
INSERT INTO `character_modules` VALUES (19, 5, 1);
INSERT INTO `character_modules` VALUES (20, 5, 2);
INSERT INTO `character_modules` VALUES (70, 3, 1);
INSERT INTO `character_modules` VALUES (72, 3, 2);
INSERT INTO `character_modules` VALUES (73, 3, 7);
INSERT INTO `character_modules` VALUES (74, 3, 3);
INSERT INTO `character_modules` VALUES (75, 6, 1);
INSERT INTO `character_modules` VALUES (76, 4, 6);
INSERT INTO `character_modules` VALUES (77, 4, 9);
INSERT INTO `character_modules` VALUES (78, 4, 4);
INSERT INTO `character_modules` VALUES (79, 4, 1);
INSERT INTO `character_modules` VALUES (80, 4, 12);
INSERT INTO `character_modules` VALUES (81, 1, 13);
INSERT INTO `character_modules` VALUES (82, 1, 14);
INSERT INTO `character_modules` VALUES (83, 1, 15);
INSERT INTO `character_modules` VALUES (84, 1, 16);
INSERT INTO `character_modules` VALUES (87, 4, 2);

-- ----------------------------
-- Table structure for character_roles
-- ----------------------------
DROP TABLE IF EXISTS `character_roles`;
CREATE TABLE `character_roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `character_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_character_roles_roleid`(`role_id` ASC) USING BTREE,
  INDEX `idx_character_roles_characterid`(`character_id` ASC) USING BTREE,
  CONSTRAINT `fk_character_roles_characterid` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_character_roles_roleid` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of character_roles
-- ----------------------------
INSERT INTO `character_roles` VALUES (1, 1, 1);
INSERT INTO `character_roles` VALUES (2, 1, 2);
INSERT INTO `character_roles` VALUES (3, 1, 3);
INSERT INTO `character_roles` VALUES (4, 1, 4);
INSERT INTO `character_roles` VALUES (5, 1, 5);
INSERT INTO `character_roles` VALUES (6, 1, 6);
INSERT INTO `character_roles` VALUES (7, 1, 7);
INSERT INTO `character_roles` VALUES (8, 1, 8);
INSERT INTO `character_roles` VALUES (9, 5, 1);
INSERT INTO `character_roles` VALUES (22, 1, 9);
INSERT INTO `character_roles` VALUES (23, 2, 10);
INSERT INTO `character_roles` VALUES (24, 2, 1);
INSERT INTO `character_roles` VALUES (25, 1, 13);
INSERT INTO `character_roles` VALUES (29, 3, 5);
INSERT INTO `character_roles` VALUES (30, 3, 6);
INSERT INTO `character_roles` VALUES (31, 3, 1);
INSERT INTO `character_roles` VALUES (32, 1, 14);
INSERT INTO `character_roles` VALUES (33, 1, 17);
INSERT INTO `character_roles` VALUES (34, 1, 18);
INSERT INTO `character_roles` VALUES (35, 1, 19);
INSERT INTO `character_roles` VALUES (36, 1, 20);
INSERT INTO `character_roles` VALUES (37, 4, 10);
INSERT INTO `character_roles` VALUES (38, 4, 8);
INSERT INTO `character_roles` VALUES (39, 4, 7);
INSERT INTO `character_roles` VALUES (42, 1, 10);
INSERT INTO `character_roles` VALUES (44, 4, 1);

-- ----------------------------
-- Table structure for characters
-- ----------------------------
DROP TABLE IF EXISTS `characters`;
CREATE TABLE `characters`  (
  `id` int(2) NOT NULL AUTO_INCREMENT,
  `key` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `state` int(11) NOT NULL DEFAULT 1,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `description` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `key_UNIQUE`(`key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of characters
-- ----------------------------
INSERT INTO `characters` VALUES (1, 'admin', 1, '超级管理员', '开放所有权限（不可删除）');
INSERT INTO `characters` VALUES (2, 'editor', 1, '新闻编辑者', '负责新闻编辑');
INSERT INTO `characters` VALUES (3, 'checker ', 1, '新闻审核员', '负责审核新闻');
INSERT INTO `characters` VALUES (4, 'publisher', 1, '新闻发布者', '负责新闻发布');
INSERT INTO `characters` VALUES (5, 'operator', 1, '新闻运营', '可查看新闻概况、分类、审核情况、发布情况等数据');
INSERT INTO `characters` VALUES (6, 'visitor', 1, '游客', '什么也干不了，后备项（不可删除）');

-- ----------------------------
-- Table structure for module
-- ----------------------------
DROP TABLE IF EXISTS `module`;
CREATE TABLE `module`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) NULL DEFAULT 0,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `key` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `state` int(11) NULL DEFAULT 1,
  `menu` int(11) NULL DEFAULT 1 COMMENT '判断是否为菜单路由',
  `order` int(11) NULL DEFAULT 99,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `key_UNIQUE`(`key` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of module
-- ----------------------------
INSERT INTO `module` VALUES (1, 0, '首页', 'home', 1, 1, 99);
INSERT INTO `module` VALUES (2, 0, '用户列表', 'user-manage/list', 1, 1, 99);
INSERT INTO `module` VALUES (3, 0, '权限管理', 'power-manage', 1, 1, 99);
INSERT INTO `module` VALUES (4, 0, '新闻管理', 'news-manage', 1, 1, 99);
INSERT INTO `module` VALUES (5, 0, '审核管理', 'check-manage', 1, 1, 99);
INSERT INTO `module` VALUES (6, 0, '发布管理', 'publish-manage', 1, 1, 99);
INSERT INTO `module` VALUES (7, 3, '模块列表', 'power-manage/rolelist', 1, 1, 2);
INSERT INTO `module` VALUES (8, 3, '角色列表', 'power-manage/characterlist', 1, 1, 1);
INSERT INTO `module` VALUES (9, 4, '撰写新闻', 'news-manage/createdraft', 1, 1, 1);
INSERT INTO `module` VALUES (10, 4, '草稿箱', 'news-manage/draft', 1, 1, 2);
INSERT INTO `module` VALUES (12, 4, '分类列表', 'news-manage/sort', 1, 1, 3);
INSERT INTO `module` VALUES (13, 4, '新闻预览', 'news-manage/preview/:id', 1, 0, 99);
INSERT INTO `module` VALUES (14, 4, '编辑草稿', 'news-manage/draft/:id', 1, 0, 99);
INSERT INTO `module` VALUES (15, 5, '审核列表', 'check-manage/list', 1, 1, 99);
INSERT INTO `module` VALUES (16, 5, '审核新闻', 'check-manage/check', 1, 1, 99);

-- ----------------------------
-- Table structure for news_checks
-- ----------------------------
DROP TABLE IF EXISTS `news_checks`;
CREATE TABLE `news_checks`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `check_time` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审核时间',
  `check_person` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '审核人',
  `check_comment` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL COMMENT '通过或不通过的原因',
  `news_id` int(11) NOT NULL,
  `submit_time` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `check_result` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_news_checks_news1_idx`(`news_id` ASC) USING BTREE,
  INDEX `fk_check_peson_idx`(`check_person` ASC) USING BTREE,
  CONSTRAINT `fk_check_person` FOREIGN KEY (`check_person`) REFERENCES `user` (`username`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_news_checks_news1` FOREIGN KEY (`news_id`) REFERENCES `news_detail` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 37 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news_checks
-- ----------------------------
INSERT INTO `news_checks` VALUES (3, '2022-05-17 10:05:36', 'admin', NULL, 7, '2022-05-10 15:48:00', 1);
INSERT INTO `news_checks` VALUES (18, '2022-05-17 10:31:05', 'admin', NULL, 15, '2022-05-17 10:09:46', 2);
INSERT INTO `news_checks` VALUES (20, '2022-05-17 10:31:56', 'admin', '行了行了', 15, '2022-05-17 10:31:14', 1);
INSERT INTO `news_checks` VALUES (21, '2022-05-17 11:25:03', 'admin', '不太行', 22, '2022-05-17 11:23:33', 2);
INSERT INTO `news_checks` VALUES (24, '2024-08-30 15:01:29', 'admin', 'ok', 28, '2024-08-30 14:57:14', 1);
INSERT INTO `news_checks` VALUES (25, '2024-08-30 15:01:35', 'admin', 'ok\n', 29, '2024-08-30 14:57:16', 1);
INSERT INTO `news_checks` VALUES (26, '2024-08-30 20:03:45', 'admin', '阿萨德', 30, '2024-08-30 15:26:20', 2);
INSERT INTO `news_checks` VALUES (27, '2024-08-30 20:03:47', 'admin', '1', 26, '2024-08-30 15:26:21', 1);
INSERT INTO `news_checks` VALUES (28, '2024-08-30 20:03:57', 'admin', '1 ', 27, '2024-08-30 15:26:22', 1);
INSERT INTO `news_checks` VALUES (29, '2024-08-30 20:03:55', 'admin', '1', 25, '2024-08-30 15:26:22', 1);
INSERT INTO `news_checks` VALUES (30, '2024-08-30 20:03:52', 'admin', '1', 24, '2024-08-30 15:26:22', 1);
INSERT INTO `news_checks` VALUES (31, '2024-08-30 20:03:50', 'admin', '1', 21, '2024-08-30 15:26:22', 1);
INSERT INTO `news_checks` VALUES (32, '2024-08-30 20:03:41', 'admin', '萨达', 31, '2024-08-30 20:03:33', 1);
INSERT INTO `news_checks` VALUES (33, '2024-08-30 20:16:21', 'admin', 'sad ', 32, '2024-08-30 20:16:16', 1);
INSERT INTO `news_checks` VALUES (34, '2024-08-30 20:18:59', 'admin', 'asdd ', 33, '2024-08-30 20:18:49', 1);
INSERT INTO `news_checks` VALUES (35, '2024-08-30 20:26:00', 'admin', '爱上', 34, '2024-08-30 20:25:55', 1);
INSERT INTO `news_checks` VALUES (36, '2024-08-30 21:32:26', 'admin', '111', 35, '2024-08-30 21:32:19', 1);

-- ----------------------------
-- Table structure for news_comments
-- ----------------------------
DROP TABLE IF EXISTS `news_comments`;
CREATE TABLE `news_comments`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `comment_name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `comment_content` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `news_id` int(11) NOT NULL,
  `create_time` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_news_conments_news1_idx`(`news_id` ASC) USING BTREE,
  CONSTRAINT `fk_news_conments_news1` FOREIGN KEY (`news_id`) REFERENCES `news_detail` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news_comments
-- ----------------------------
INSERT INTO `news_comments` VALUES (1, 'admin', 'asdasdasd', 21, '2024-08-31 14:35:26');
INSERT INTO `news_comments` VALUES (2, 'admin', 'eadasas ', 21, '2024-08-31 14:37:40');
INSERT INTO `news_comments` VALUES (3, 'admin', 'sadasqd ', 21, '2024-08-31 14:44:06');
INSERT INTO `news_comments` VALUES (4, 'admin', '撒大苏打', 21, '2024-08-31 14:51:30');
INSERT INTO `news_comments` VALUES (5, 'admin', '撒大苏打', 21, '2024-08-31 14:57:45');

-- ----------------------------
-- Table structure for news_detail
-- ----------------------------
DROP TABLE IF EXISTS `news_detail`;
CREATE TABLE `news_detail`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `content` text CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `check_state` int(11) NULL DEFAULT 1 COMMENT '1-草稿；2-正在审核；3-已通过；4-未通过',
  `create_time` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `star` int(11) NULL DEFAULT 0,
  `view` int(11) NULL DEFAULT 0,
  `update_time` varchar(45) CHARACTER SET utf8 COLLATE utf8_esperanto_ci NULL DEFAULT NULL,
  `publish_state` int(11) NULL DEFAULT 1 COMMENT '1-未审核或正在审核；2-待发布（审核通过）3-已发布；4-已下线',
  `sort_id` int(11) NOT NULL,
  `latest_check_id` int(11) NULL DEFAULT NULL,
  `comment` int(11) NULL DEFAULT 0,
  `author_name` varchar(45) CHARACTER SET utf8 COLLATE utf8_esperanto_ci NOT NULL,
  `visits` int(11) NULL DEFAULT 0,
  `likes` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `fk_sort_id_idx`(`sort_id` ASC) USING BTREE,
  INDEX `fk_latest_check_id_idx`(`latest_check_id` ASC) USING BTREE,
  INDEX `fk_author_name_idx`(`author_name` ASC) USING BTREE,
  CONSTRAINT `fk_latest_check_id` FOREIGN KEY (`latest_check_id`) REFERENCES `news_checks` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_sort_id` FOREIGN KEY (`sort_id`) REFERENCES `news_sorts` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = utf8 COLLATE = utf8_esperanto_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news_detail
-- ----------------------------
INSERT INTO `news_detail` VALUES (7, '这是一个标题', '<p><br></p>', 3, '2022-05-15 15:36:03', 0, 0, '2022-05-15 15:28:31', 4, 1, 3, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (13, '这样子可以吗', '<p>哈哈哈哈就是好真的假的</p>', 4, '2022-05-15 23:35:38', 0, 0, '2022-05-17 10:25:03', 1, 2, NULL, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (15, '我再试试3333', '<p>可以吗宝</p>', 3, '2022-05-16 11:29:13', 0, 0, '2022-05-17 10:31:14', 4, 3, 20, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (21, 'sgfisgfus', '<p>haowenzi</p>', 3, '2022-05-17 11:18:08', 0, 0, '2024-08-30 11:47:05', 3, 5, 31, 0, 'admin', 87, 2);
INSERT INTO `news_detail` VALUES (22, 'guisgvosd', '<p>sss</p>', 4, '2022-05-17 11:23:33', 0, 0, '2022-05-17 11:23:33', 1, 1, 21, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (24, 'dsf ', '<p>ds </p>', 3, '2024-08-30 12:51:30', 0, 0, '2024-08-30 12:51:30', 3, 8, 30, 0, 'admin', 6, 0);
INSERT INTO `news_detail` VALUES (25, 'q', '<p>q</p>', 3, '2024-08-30 12:52:09', 0, 0, '2024-08-30 12:52:09', 3, 1, 29, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (26, 'sda ', '<p>sad </p>', 3, '2024-08-30 13:33:00', 0, 0, '2024-08-30 13:33:00', 3, 8, 27, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (27, 'as ', '<p>sa</p>', 3, '2024-08-30 13:56:37', 0, 0, '2024-08-30 13:56:37', 3, 1, 28, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (28, 'wec ', '<p>dw1211111</p>', 3, '2024-08-30 13:57:17', 0, 0, '2024-08-30 14:54:17', 3, 1, 24, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (29, '14/47', '<p>阿达</p>', 3, '2024-08-30 14:47:45', 0, 0, '2024-08-30 14:49:24', 3, 1, 25, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (30, '阿萨德', '<p>爱上</p>', 4, '2024-08-30 14:57:41', 0, 0, '2024-08-30 14:57:41', 1, 8, 26, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (31, 'test', '<img src=\"https://img2.baidu.com/it/u=1237025922,2679733234&fm=253&fmt=auto&app=120&f=JPEG?w=749&h=500\" />\n<p>请问请问</p>', 3, '2024-08-30 20:03:18', 0, 0, '2024-08-30 20:03:18', 3, 4, 32, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (32, 'test111', '<img src=\"<img src=\"https://img2.baidu.com/it/u=1237025922,2679733234&fm=253&fmt=auto&app=120&f=JPEG?w=749&h=500\">\" />\n<p>asdassa</p>', 3, '2024-08-30 20:16:16', 0, 0, '2024-08-30 20:16:16', 3, 1, 33, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (33, '111111111111', '<img src=\"https://image.baidu.com/search/detail?ct=503316480&z=0&ipn=d&word=%E5%9B%BE%E7%89%87&hs=0&pn=1&spn=0&di=7400427937490534401&pi=0&rn=1&tn=baiduimagedetail&is=0%2C0&ie=utf-8&oe=utf-8&cl=2&lm=-1&cs=2452126922%2C2281773104&os=3087206786%2C450288010&simid=4197234551%2C444498872&adpicid=0&lpn=0&ln=30&fr=ala&fm=&sme=&cg=&bdtype=0&oriquery=%E5%9B%BE%E7%89%87&objurl=https%3A%2F%2Fpic1.arkoo.com%2F6DEEAF68749141718F5A0D8B55E944C6%2Fpicture%2Fo_1hbiekio61p675qj6id1imol7m1ub.jpg&fromurl=ippr_z2C%24qAzdH3FAzdH3Fooo_z%26e3Btfjgstg_z%26e3BvgAzdH3Ffu_0nEdmmDBEa8m9aF9lnFl088F8bbFAbFD_dal_AlcddcdCd8c_z%26e3Bip4s&gsm=&islist=&querylist=&dyTabStr=MCwzLDEsMiwxMyw3LDYsNSwxMiw5\" />\n<p>sadas</p>', 3, '2024-08-30 20:18:49', 0, 0, '2024-08-30 20:18:49', 4, 1, 34, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (34, '萨达', '<img src=\"http://gips0.baidu.com/it/u=1690853528,2506870245&fm=3028&app=3028&f=JPEG&fmt=auto?w=1024&h=1024\" />\n<p>啊撒大声地</p>', 3, '2024-08-30 20:25:55', 0, 0, '2024-08-30 20:25:55', 3, 1, 35, 0, 'admin', 0, 0);
INSERT INTO `news_detail` VALUES (35, '22222', '<img src=\"https://pic4.zhimg.com/80/v2-267217db1a16cf81a50184ea7d520289_1440w.webp\" />\n<p>2</p>', 3, '2024-08-30 21:32:19', 0, 0, '2024-08-30 21:32:19', 3, 1, 36, 0, 'admin', 0, 0);

-- ----------------------------
-- Table structure for news_sorts
-- ----------------------------
DROP TABLE IF EXISTS `news_sorts`;
CREATE TABLE `news_sorts`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `color` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `state` tinyint(1) NULL DEFAULT 1,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `id_UNIQUE`(`id` ASC) USING BTREE,
  UNIQUE INDEX `name_UNIQUE`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news_sorts
-- ----------------------------
INSERT INTO `news_sorts` VALUES (1, '时事新闻', 'geekblue', 1);
INSERT INTO `news_sorts` VALUES (2, '环球经济', 'red', 1);
INSERT INTO `news_sorts` VALUES (3, '科学技术', 'purple', 1);
INSERT INTO `news_sorts` VALUES (4, '军事世界', '#D8AD87', 1);
INSERT INTO `news_sorts` VALUES (5, '世界体育', '#818BD7', 1);
INSERT INTO `news_sorts` VALUES (6, '生活理财', '#D47799', 1);
INSERT INTO `news_sorts` VALUES (8, '其他', 'black', 1);

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `key` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `module_id` int(11) NOT NULL,
  PRIMARY KEY (`id`, `module_id`) USING BTREE,
  UNIQUE INDEX `key_UNIQUE`(`key` ASC) USING BTREE,
  INDEX `fk_role_module1_idx`(`module_id` ASC) USING BTREE,
  CONSTRAINT `fk_role_module1` FOREIGN KEY (`module_id`) REFERENCES `module` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 21 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of roles
-- ----------------------------
INSERT INTO `roles` VALUES (1, '增加用户', 'userAdd', 2);
INSERT INTO `roles` VALUES (2, '删除用户', 'userDelete', 2);
INSERT INTO `roles` VALUES (3, '增加角色', 'characterAdd', 8);
INSERT INTO `roles` VALUES (4, '更改角色状态', 'characterState', 8);
INSERT INTO `roles` VALUES (5, '增改分类', 'sortAddUpdate', 12);
INSERT INTO `roles` VALUES (6, '删除分类', 'sortDelete', 12);
INSERT INTO `roles` VALUES (7, '删除发布', 'publishDelete', 6);
INSERT INTO `roles` VALUES (8, '更改发布', 'publishUpdate', 6);
INSERT INTO `roles` VALUES (9, '删除角色', 'characterDelete', 8);
INSERT INTO `roles` VALUES (10, '查看全部审核列表', 'checkAll', 15);
INSERT INTO `roles` VALUES (13, '修改角色', 'characterUpdate', 8);
INSERT INTO `roles` VALUES (14, '更新用户状态', 'userState', 2);
INSERT INTO `roles` VALUES (17, '更新模块状态', 'moduleState', 7);
INSERT INTO `roles` VALUES (18, '增加模块', 'moduleAdd', 7);
INSERT INTO `roles` VALUES (19, '更改模块', 'moduleUpdate', 7);
INSERT INTO `roles` VALUES (20, '更新用户', 'userUpdate', 2);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `password` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sex` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `email` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `character_id` int(2) NOT NULL DEFAULT 6,
  `image_url` varchar(255) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `state` int(11) NULL DEFAULT 1 COMMENT '0为被删除\n1为存在',
  PRIMARY KEY (`id`, `character_id`) USING BTREE,
  UNIQUE INDEX `name_UNIQUE`(`username` ASC) USING BTREE,
  INDEX `fk_user_character1_idx`(`character_id` ASC) USING BTREE,
  CONSTRAINT `fk_character_users_character_id` FOREIGN KEY (`character_id`) REFERENCES `characters` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'admin', '123456', '2022-05-09 22:12:34', '女', '1342226@qq.com', 1, 'http://localhost:8080/uploads/7uTfKR1vwOUULc2rO1woB7wx.jpg', 1);
INSERT INTO `user` VALUES (2, '111111', '111111', '2022-05-09 22:12:34', '', NULL, 3, 'http://localhost:8080/uploads/naBfaeTL6gFtPM1qW6I2l2N7.jpg', 1);
INSERT INTO `user` VALUES (3, '123456', '123456', '2022-05-09 22:12:34', '', NULL, 3, NULL, 1);
INSERT INTO `user` VALUES (5, '222222', '222222', '2022-05-18 17:50:32', '', NULL, 6, NULL, 1);
INSERT INTO `user` VALUES (6, '444444', '444444', '2022-05-09 22:50:04', NULL, NULL, 3, NULL, 1);
INSERT INTO `user` VALUES (7, '555555', '555555', '2022-05-18 15:39:50', NULL, NULL, 3, NULL, 0);
INSERT INTO `user` VALUES (10, '666666', '666666', '2022-05-11 11:00:51', '', NULL, 3, NULL, 1);
INSERT INTO `user` VALUES (11, '777777', '777777', '2022-05-18 15:39:38', '', NULL, 3, NULL, 1);
INSERT INTO `user` VALUES (12, '888888', '888888', '2022-05-18 15:38:57', '男', '235732@qq.com', 3, NULL, 1);
INSERT INTO `user` VALUES (13, 'admin123', 'admin123', '2022-05-18 15:49:43', '', NULL, 2, NULL, 1);
INSERT INTO `user` VALUES (15, '3333', '3333', '2022-05-18 17:50:32', '', NULL, 6, NULL, 1);
INSERT INTO `user` VALUES (16, '343434', '343434', '2022-05-18 15:50:13', '男', '2452rw@qq.com', 3, NULL, 1);
INSERT INTO `user` VALUES (17, '66666666', '66666666', '2022-05-18 15:52:55', '', '6666666@qq.com', 2, NULL, 1);
INSERT INTO `user` VALUES (18, 'xxxfliu', '123456', '2024-08-31 09:29:50', '', '446914334@qq.com', 2, NULL, 1);

-- ----------------------------
-- View structure for character_modules_state_view
-- ----------------------------
DROP VIEW IF EXISTS `character_modules_state_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `character_modules_state_view` AS select `cm`.`id` AS `id`,`cm`.`character_id` AS `character_id`,`cm`.`module_id` AS `module_id` from (`character_modules` `cm` join `module` `m` on((`cm`.`module_id` = `m`.`id`))) where (`m`.`state` = 1) order by `cm`.`character_id`,`cm`.`module_id`;

-- ----------------------------
-- View structure for character_roles_view
-- ----------------------------
DROP VIEW IF EXISTS `character_roles_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `character_roles_view` AS select `r`.`id` AS `role_id`,`r`.`name` AS `role_name`,`r`.`key` AS `role_key`,`cr`.`character_id` AS `character_id` from (`character_roles` `cr` join `roles` `r` on((`r`.`id` = `cr`.`role_id`)));

-- ----------------------------
-- View structure for module_view
-- ----------------------------
DROP VIEW IF EXISTS `module_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `module_view` AS select `m`.`parent_id` AS `parent_id`,`m`.`id` AS `module_id`,`m`.`name` AS `label`,`m`.`key` AS `key`,`cm`.`character_id` AS `character_id`,`m`.`menu` AS `menu`,`m`.`state` AS `state`,`m`.`order` AS `order` from (`module` `m` join `character_modules` `cm` on((`m`.`id` = `cm`.`module_id`))) order by `cm`.`character_id`,`m`.`parent_id`,`m`.`id`,`m`.`order`;

-- ----------------------------
-- View structure for news_checklist_view
-- ----------------------------
DROP VIEW IF EXISTS `news_checklist_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `news_checklist_view` AS select `nd`.`id` AS `id`,`nd`.`title` AS `title`,`nd`.`sort_id` AS `sort_id`,`nd`.`latest_check_id` AS `latest_check_id`,`nd`.`publish_state` AS `publish_state`,`nc`.`submit_time` AS `submit_time`,`nc`.`check_person` AS `check_person`,`nd`.`check_state` AS `check_state`,`nc`.`check_time` AS `check_time`,`nc`.`check_comment` AS `check_comment`,`nd`.`author_name` AS `author_name`,`nd`.`content` AS `content` from (`news_detail` `nd` join `news_checks` `nc` on((`nd`.`latest_check_id` = `nc`.`id`))) where (`nd`.`check_state` <> 1);

-- ----------------------------
-- View structure for news_draflist_view
-- ----------------------------
DROP VIEW IF EXISTS `news_draflist_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `news_draflist_view` AS select `nd`.`id` AS `id`,`nd`.`title` AS `title`,`nd`.`update_time` AS `update_time`,`nd`.`create_time` AS `create_time`,`nd`.`author_name` AS `author_name`,`nd`.`check_state` AS `check_state`,`ns`.`id` AS `sort_id` from (`news_detail` `nd` join `news_sorts` `ns` on((`nd`.`sort_id` = `ns`.`id`))) where (`nd`.`check_state` = 1);

-- ----------------------------
-- View structure for role_module_view
-- ----------------------------
DROP VIEW IF EXISTS `role_module_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `role_module_view` AS select `r`.`id` AS `id`,`r`.`name` AS `name`,`r`.`key` AS `key`,`r`.`module_id` AS `module_id`,`m`.`name` AS `module_name` from (`roles` `r` join `module` `m` on((`r`.`module_id` = `m`.`id`))) order by `r`.`module_id`;

-- ----------------------------
-- View structure for userlist_view
-- ----------------------------
DROP VIEW IF EXISTS `userlist_view`;
CREATE ALGORITHM = UNDEFINED SQL SECURITY DEFINER VIEW `userlist_view` AS select `u`.`id` AS `id`,`u`.`username` AS `username`,`u`.`sex` AS `sex`,`u`.`email` AS `email`,`c`.`name` AS `character_name`,`c`.`id` AS `character_id`,`u`.`create_time` AS `create_time`,`u`.`state` AS `state` from (`user` `u` join `characters` `c` on((`u`.`character_id` = `c`.`id`))) order by `u`.`create_time`;

SET FOREIGN_KEY_CHECKS = 1;
