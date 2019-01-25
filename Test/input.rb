require 'socket'
require './kakinaosi.rb'
require './mojitest.rb'
# 初期設定
port = 8080
server = TCPServer.open(port)
length = 0
json_data = Array.new()
# ソケット通信
loop do
  socket = server.accept

  # HTTPメッセージを1行ずつ読み出す
  while buffer = socket.gets
    # puts buffer

    # Content-Lengthの値をlengthに格納
    if buffer.include? "Content-Length"
      length = buffer.split[1].to_i
    end
#p length
    # 改行のみ→次の行以降はBody
    if buffer == "\r\n"
      # BodyからContent-Length文字読み出す
      length.times do
        json_data.push(socket.getc)
       # puts socket.getc

      end
      # puts json_data
      break
    end  
  end
  test(json_data.join)
  result = net_parse(json_data.join)
  # puts result
 # socket.puts result
  json_data.slice!(0,length)
  # puts "\n\n"

  # 無条件に200OKを返しているので必要あれば変更する
  socket.puts "HTTP/1.1 200 OK"
  socket.puts "Content-Type: test/plaon"
  socket.puts
 # socket.puts "ok"
  socket.puts result
  socket.close
end

server.close
