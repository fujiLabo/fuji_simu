f = File.open("aa.xml")
s = f.read
f.close
s.to_xml

p s
