class HomeController < ApplicationController

  require 'json'

  def top
  end

  def main
  end

  def temp
  end

  def create
  end

  # def net_check
  #   response.headers['X-Frame-Options'] = 'ALLOWALL'
  #

#     #net_check
#     hash = params.require(:postJsonData)
#     printf hash
#
#     #File.open("/NewNetworkSimulator/study/test.json") do |file|
#     #File.open("test.json") do |file|
#       #hash = JSON.load(file)
#       seg = hash["total_seg_num"]
#       total = hash["total_node_num"]
#       router = 0
#       flag = 0
#       node_check = 0
#       submask = 0
#       subbit = 16777216
#       sub = hash["seg1"][0]["seg"]
#       ary = sub.split(".")
#       ary.each{|s|
#         submask = submask + s.to_i * subbit
#         subbit = subbit/256
#       }
#     #p submask.to_s(2)
#       for x in 1..seg do
#         #puts x
#         num = x.to_s
#         node = hash["seg"+num][0]["node_num"]
#         ipadd = Array.new() #正確にはネットワークアドレスを入れる配列
#         ip4 = Array.new() #ホスト部のアドレスを入れる配列
#         i = 0
#         for y in 1..node do
#           node_check += 1
#           ip =  hash["seg"+num][y]["IP"]+"\n" #IPアドレスを取り出し
#           if(hash["seg"+num][y]["type"] == 1)
#             router += 1
#           end
#           ary = ip.split(".")
#           bit = 16777216
#           adb = 0
#           ip4.push(ary[3])
#           ary.each{|s|
#             adb = adb + s.to_i * bit
#             bit = bit/256
#           }
#
#           adb = adb & submask
#           ipadd.push(adb)
#           #p adb.to_s(2)
#           #p ipadd[i]
#           #p i
#           #i += 1
#
#         end
#         #ホストに同じ値が入ってたらエラー返す
#           for a in 0..node-2 do
#             for b in a+1..node-1 do
#               if(ip4[a]==ip4[b])
#                 flag += 1
#                 #puts "Error!"
#                 #puts a
#                 #puts b
#               end
#             end
#           end
#
#     #異なるネットワークアドレスが入ってたらエラー返す
#           for a in 0..node-2 do
#             for b in a+1..node-1 do
#               if(ipadd[a]!=ipadd[b])
#                 #puts "Error!"
#                 flag += 1
#               end
#             end
#           end
#
#       end
#      #p node_check
#
#        #ルータの判定
#       router = router/2
#       #p router
#
#       #p node_check-router
#       if(node_check-router != total)
#         flag += 1
#       end
#       if(flag == 0)
#         puts ("true")
#       else
#       #  p flag
#         puts("false")
#       end
#      system('rm test.json')
#     end

def net_check
  require 'json'

  hash = params.require(:postData)

def addres(ip)
  result = 0
  #p ip
  subbit = 16777216
  ary = ip.split(".")
  ary.each{|s|
    result = result + s.to_i * subbit
    subbit = subbit/256
  }
  return result
end

def find_link(hash,i)
  j=0
  k = 0
  s=0
  r = hash["nodeInfo"][i]["link"][1]
  r = r.to_i
  while hash["nodeInfo"][i]["link"][0]!=hash["nodeInfo"][j]["name"]#見つける
    j = j+1
  end
  #p hash["nodeInfo"][j]["name"]
  ip1 = hash["nodeInfo"][i]["ip"]
  sm1 = hash["nodeInfo"][i]["sm"]
  ip2 = hash["nodeInfo"][j]["ip"][r]
  sm2 = hash["nodeInfo"][j]["sm"][r]
  ip1 = addres(ip1)
  sm1 = addres(sm1)
  ip2 = addres(ip2)
  sm2 = addres(sm2)
  ip1 = ip1&sm1
  ip2 = ip2&sm2
  if ip1 == ip2
    return 1
  else
    return 0
  end
end


def find(hash,nusi,x)
  #もし主と宛先が繋がってたらリターン、それ以外なら再起
  #p nusi
  succses_flag = 0
  result =""
  a=0
  i = 0
  j = 0
  while nusi!=hash["nodeInfo"][i]["name"]#見つける
    i = i+1
  end

  if nusi.include?("Router")
    #Routerだった場合の処理
    #宛先のネットワークアドレスを出しておく

    ip1 = hash["getNode"][x]["ip"]
    sm1 = hash["getNode"][x]["sm"]
    ip1 = addres(ip1)
    sm1 = addres(sm1)
    ip1 = ip1&sm1
    while hash["nodeInfo"][i]["routingtable"][a] != nil
      #ルーティングテーブルのhash["nodeInfo"][i]["routingtable"][a]["ip"]と宛先のネットワークアドレスを比較
      ip2 = hash["nodeInfo"][i]["routingtable"][a]["ip"]
      sm2 = hash["nodeInfo"][i]["routingtable"][a]["sm"]
      if sm2 == "none"
        ip2 = addres(ip2)
      else
        ip2 = addres(ip2)
        sm2 = addres(sm2)
        ip2 = ip2&sm2
      end
      if ip1 == ip2
        succses_flag = 1
        break
      end
      #一致したらしたのif文へ
      #break
      #succses_flag=1
      a=a+1
    end

    if succses_flag != 1
      return hash["nodeInfo"][i]["name"]
    end
    if hash["nodeInfo"][i]["routingtable"][a]["nha"] == "DirectConected"
        #ルータからパソコンの場合はここで比較
        #繋がってたら正解
        return "ok"
    else
        #ルータからルータ
        #hash["nodeInfo"][1+j]["ip"]と#hash["nodeInfo"][j]["routingtable"][a]["ip"]を比較
        #合ってればlinkを見て、探し、nhaと比較、できたらnusi=link
        nha = hash["nodeInfo"][i]["routingtable"][a]["nha"]
        link = hash["nodeInfo"][i]["routingtable"][a]["link"][0]
        linkip = hash["nodeInfo"][i]["routingtable"][a]["link"][1]
        linkip = linkip.to_i
        while link != hash["nodeInfo"][j]["name"]
          j = j+1
        end
        #ルーター同士のIPアドレス比較する！！
        if hash["nodeInfo"][j]["ip"][linkip] == nha
          return result = find(hash,link,x)
        else
          return hash["nodeInfo"][j]["name"]
        end
    end




  else#PCからルータ

    result = find_link(hash,i)
    if result == 0
      return nusi
    else
      result = find(hash,hash["nodeInfo"][i]["link"][0],x)
    end
  end
end

def net_parse(data)
  hash = JSON.parse(data)
  #p hash
  nusi = hash["sendNode"]["name"]
  result = ""
  flag = 0
  node_num = hash["getNode"].count
  #p node_num
  for x in 1..node_num do
    result = find(hash,nusi,x-1)
  end
p result
end
