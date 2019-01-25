require 'mysql'  
  
# MySQL に接続します。  
my = Mysql.new('localhost', 'root', 'Td;Rk;Fk;', 'Test')  
  
# SQL クエリを実行します。  
res = my.query('SELECT * from Questions')  
  
# 結果を表示します。  
res.each do |row|  
  puts row  
end  
