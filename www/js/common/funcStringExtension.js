/**字符串相关操作
 * Created by ddllzz on 16/9/19
 */

///
/*去除字符串空格*/
///
String.prototype.trimSpace = function() {
  return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

String.prototype.replaceAll = function(s1,s2){
  return this.replace(new RegExp(s1,"gm"),s2);
}
