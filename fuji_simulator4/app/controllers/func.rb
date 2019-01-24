require 'json'
def find_ip(hash,ip)
  i = 0
  while hash["nodeInfo"][i] != nil
    if hash["nodeInfo"][i]["name"].include?("Router")
      for x in 0..hash["nodeInfo"][i]["ip"].count-1 do
        if hash["nodeInfo"][i]["ip"][x] == ip
          return hash["nodeInfo"][i]["name"]
        end
      end
    else
      if hash["nodeInfo"][i]["ip"] == ip
        return hash["nodeInfo"][i]["name"]
      end
    end
    i = i+1
  end
  return 1
end
def bus_check(hash,bus,sm)
  #サブネットマスクと論理積！！！！！
  #p bus
  seg_num = 0
  rip = Array.new()
  pcip = Array.new()
  mask = addres(sm)
  r_count = 0
  p_count = 0
  a = 0
  seikai = 0
#どのバスか
  while hash["busInfo"][a]["name"] != bus
    a = a+1
  end
  #p a

  #バスの中身と情報を照合してipを比較
  #バスの一つ一つと照らし合わせる
  for x in 0..hash["busInfo"][a]["nodes"].count-1 do
    #p hash["busInfo"][a]["nodes"][x]
    i = 0
   while hash["nodeInfo"][i]["name"]!=hash["busInfo"][a]["nodes"][x]#見つける
     #p hash["nodeInfo"][i]["name"]+" and "+hash["busInfo"][a]["nodes"][x]
     i = i+1
   end
   #先にPCたちを比較して、最後にルーターのどちらか片方が正解していればいい
   if hash["busInfo"][a]["nodes"][x].include?("Router")
     r_count = r_count+1
     seg_num = seg_num+hash["nodeInfo"][i]["ip"].count
     for y in 0..hash["nodeInfo"][i]["ip"].count-1 do
       rip.push(addres(hash["nodeInfo"][i]["ip"][y])&mask)
     end
   else
     p_count = p_count+1
     rip.push(addres(hash["nodeInfo"][i]["ip"])&mask)
   end
  end
  #p rip
  #すべてのノードを比較
  for m in 0..p_count+seg_num-2 do
    for n in m+1..p_count+seg_num-1 do
      if(rip[m]==rip[n])
        tmp = rip[m]
        seikai=seikai+1
      end
    end
  end
  #ノードの数-1の数列の和が正解の数とあってたら正解
  goukei = 0
  for o in 1..p_count+r_count-1 do
    goukei = goukei+o
  end

  if seikai != goukei
    return 1
  else
    return tmp&mask
  end
end
def addres(ip)
  result = 0
  #p ip
  subbit = 16777216
  ary = ip.split(".")
  if ary.count !=4
    return 1
  end
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
  if ip1 == 1||ip2 == 1
    return 0
  end
  if ip1 == ip2
    return 1
  else
    return 0
  end
end


def find(hash,nusi,x,aaa)
  #もし主と宛先が繋がってたらリターン、それ以外なら再起
  #p nusi+hash["nodeInfo"][x]["name"]
  aaa << nusi
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
    #p hash["nodeInfo"][x]["name"]
    ip1 = hash["nodeInfo"][x]["ip"]
    sm1 = hash["nodeInfo"][x]["sm"]
    ip1 = addres(ip1)
    sm1 = addres(sm1)
    ip1 = ip1&sm1
    if ip1 == 1
      aaa<<"0"
      return aaa
    end
    while hash["nodeInfo"][i]["routingtable"][a] != nil
      #ルーティングテーブルのhash["nodeInfo"][i]["routingtable"][a]["ip"]と宛先のネットワークアドレスを比較
      ip2 = hash["nodeInfo"][i]["routingtable"][a]["ip"]
      sm2 = hash["nodeInfo"][i]["routingtable"][a]["sm"]
      if ip2 == "DefaultGateway"
        default_flag = a
      end
      if sm2 == "none"
        ip2 = addres(ip2)
        if ip2 == 1
          aaa<<"0"
          return aaa
        end
      else
        ip2 = addres(ip2)
        sm2 = addres(sm2)
        ip2 = ip2&sm2
      end
      if ip1 == ip2
        if hash["nodeInfo"][i]["routingtable"][a]["nha"] == "0.0.0.0"
          if hash["nodeInfo"][i]["routingtable"][a]["link"][0] == hash["nodeInfo"][x]["name"]
            succses_flag = 1
            break
          elsif hash["nodeInfo"][i]["routingtable"][a]["link"].include?("bus")
            succses_flag = 1
            break
          end
          #p hash["nodeInfo"][i]["routingtable"][a]["link"]
        elsif hash["nodeInfo"][i]["routingtable"][a]["link"].include?("bus")#ルーターとルータの間にバスが絡んでる時
          bus = hash["nodeInfo"][i]["routingtable"][a]["link"]
          bus_ip = bus_check(hash,bus,hash["nodeInfo"][x]["sm"])
          #p bus
          if bus_ip!=1
            succses_flag = 1
            break
          end
        else
          succses_flag = 1
          break
        end
      end
      #一致したらしたのif文へ
      #break
      #succses_flag=1
      a=a+1
    end

    if succses_flag != 1
      if default_flag !=nil
        tugi = find_ip(hash,hash["nodeInfo"][i]["routingtable"][default_flag]["nha"])
        if tugi!=1
          return result = find(hash,tugi,x,aaa)
        else
          aaa<<"0"
          return aaa
        end
      else
        aaa << "0"
        #return hash["nodeInfo"][i]["name"]
        return aaa
      end
    end
    if hash["nodeInfo"][i]["routingtable"][a]["nha"] == "0.0.0.0"
        #ルータからパソコンの場合はここで比較
        #繋がってたら正解
        #aaa << hash["nodeInfo"][i]["routingtable"][a]["nha"]
        if hash["nodeInfo"][i]["routingtable"][a]["link"][0] == hash["nodeInfo"][x]["name"]
          aaa << hash["nodeInfo"][x]["name"]
          aaa << "1"
          return aaa
        elsif hash["nodeInfo"][i]["routingtable"][a]["link"].include?("bus")
          #p aaa
          bus = hash["nodeInfo"][i]["routingtable"][a]["link"]
          bus_ip = bus_check(hash,bus,hash["nodeInfo"][x]["sm"])
          if bus_ip ==1
            aaa << "0"
            return aaa
          end
          aaa << bus
          if hash["nodeInfo"][i]["routingtable"][a]["nha"] != "0.0.0.0"
            nxtr = find_ip(hash,hash["nodeInfo"][i]["routingtable"][a]["nha"])
            #p nxtr
            if nxtr != 1
              result = find(hash,nxtr,x,aaa)
              #p "wao"
              return result
            else
              aaa << "0"
              return aaa
            end
          else
            #p aaa
            nxtip = addres(hash["nodeInfo"][x]["ip"])
            if nxtip == 1
              aaa<<"0"
              return aaa
            end
            submask = addres(hash["nodeInfo"][x]["sm"])
            nxtip = nxtip&submask
            if bus_ip == nxtip
              #p hash["nodeInfo"][x]["name"]
              aaa << hash["nodeInfo"][x]["name"]
              aaa << "1"
              return aaa
            else
              aaa << "0"
              return aaa
            end

          end
        else
          aaa << "0"
          return aaa
        end



    else
      #p "wao"
        #ルータからルータ
        #hash["nodeInfo"][1+j]["ip"]と#hash["nodeInfo"][j]["routingtable"][a]["ip"]を比較
        #合ってればlinkを見て、探し、nhaと比較、できたらnusi=link
      if hash["nodeInfo"][i]["routingtable"][a]["ip"] == "DefaultGateway"

      else
        nha = hash["nodeInfo"][i]["routingtable"][a]["nha"]
        link = hash["nodeInfo"][i]["routingtable"][a]["link"][0]
        linkip = hash["nodeInfo"][i]["routingtable"][a]["link"][1]
        linkip = linkip.to_i
        #p hash["nodeInfo"][j]["name"]
        sameflag = 0
        #for j in 0..hash["nodeInfo"].count-1 do
        #  if link == hash["nodeInfo"][j]["name"]
        #    sameflag=1
        #    break
        #  end
        #end
        #p hash["nodeInfo"][i]["name"]
        #ルータからバスを通してルータ
        if link.include?("b")
          busip = bus_check(hash,hash["nodeInfo"][i]["routingtable"][a]["link"],hash["nodeInfo"][i]["routingtable"][a]["sm"])
          nha = addres(hash["nodeInfo"][i]["routingtable"][a]["nha"])
          if nha == 1
            aaa<<"0"
            return aaa
          end
          nsm = addres(hash["nodeInfo"][i]["routingtable"][a]["sm"])
          nha = nha&nsm
          if nha != busip
            aaa << "0"
            return aaa
          else
            tugi = find_ip(hash,hash["nodeInfo"][i]["routingtable"][a]["nha"])
            if tugi == 1
              aaa<<"0"
              return aaa
            else
              for m in 0..hash["nodeInfo"][i]["ip"].count-1 do
                if hash["nodeInfo"][i]["routingtable"][a]["nha"] == hash["nodeInfo"][i]["ip"][m]
                  aaa<<"0"
                  return aaa
                end
              end
              aaa << hash["nodeInfo"][i]["routingtable"][a]["link"]
              result = find(hash,tugi,x,aaa)
            end
          end
        else
          while link != hash["nodeInfo"][j]["name"]
            j = j+1
          end
        #ルーター同士のIPアドレス比較する！！
          if hash["nodeInfo"][j]["ip"][linkip] == nha
            return result = find(hash,link,x,aaa)
          else
            aaa << "0"
            return aaa
          #return hash["nodeInfo"][j]["name"]
          end
        end
      end
    end




  else#PCからルータ
    #p "wao"
    if hash["nodeInfo"][i]["link"].include?("bus")
      b = bus_check(hash,hash["nodeInfo"][i]["link"],hash["nodeInfo"][i]["sm"])
      #p b
      if b == 1||b == 0
        aaa << "0"
        return aaa
      end
      #p "wao"
      aaa<< hash["nodeInfo"][i]["link"]
      okurisakiip = addres(hash["nodeInfo"][x]["ip"])
      if okurisakiip == 1
        aaa<<"0"
        return aaa
      end
      okurisakism = addres(hash["nodeInfo"][x]["sm"])
      okurisakiip = okurisakiip&okurisakism
      if okurisakiip == b
        aaa << hash["nodeInfo"][x]["name"]
        aaa << "1"
        return aaa
      end
      #p hash["nodeInfo"][i]["routingtable"][0]["nha"]
      #ipからノードの名前を検索
      nxtr = find_ip(hash,hash["nodeInfo"][i]["routingtable"][0]["nha"])
      #p nxtr
      if nxtr != 1
        result = find(hash,nxtr,x,aaa)
        #p "wao"
        return result
      else
        aaa << "0"
        return aaa
      end
    else
      #p "wao"
      p_result = find_link(hash,i)
    end

    if p_result != 1
      #return nusi
      aaa << "0"
      return aaa
    else
      result = find(hash,hash["nodeInfo"][i]["link"][0],x,aaa)
    end
  end
end

def net_parse(data)
  hash = JSON.parse(data)
  #p hash
  data = Array.new()
  for a in 0..hash["pc_num"]-1 do
    for b in 0..hash["pc_num"]-1 do
      if a!=b
        nusi = hash["nodeInfo"][a]["name"]
        #p nusi
        flag = 0

        #p node_num
          aaa = Array.new()
          #bはゲットの代わり
          if hash["nodeInfo"][a]["ip"]==""||hash["nodeInfo"][a]["sm"]==""
            result = Array.new()
            result<<nusi
            result<<0
          else
            result = find(hash,nusi,b,aaa)
          #p hash["nodeInfo"][b]["name"]
          #p result
          end
          data << result
      end
    end
  end
return data.to_json

end
