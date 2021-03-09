import re


def dump_ch8(code: str, file_name: str) -> None:
    code = re.sub(r"//.+", "", code)
    code = code.replace("\n", "")
    code = re.sub("\s+", " ", code)
    code = code.strip().split(" ")

    with open(file_name, "wb") as f:
        print(" ".join(code))
        f.write(bytes(int(byte, 16) for byte in code))

def main():
    code2 = """
    00 E0 60 14 61 03
    A2 40 D0 1F 70 08
    A2 50 D0 1F 70 08
    A2 60 D0 1F 70 08
    A2 70 D0 1F
    60 14 61 12
    A2 80 D0 1F 70 08
    A2 90 D0 1F 70 08
    A2 A0 D0 1F 70 08
    A2 B0 D0 1F 70 08
    12 38
    00 00 00 00 00 00

    F8 F8 F8 F8 F8 F8 F8 F8 F8 F8 FF FF FF FF FF 00
    3F 3F 3F 3F 3F 3E 3E 3E 3E 3E FF FF FF FF FF 00
    FF FF FF FF FF 00 00 00 00 00 FF FF FF FF FF 00
    80 80 80 80 80 00 00 00 00 00 80 80 80 80 80 00
    00 00 00 00 00 FF FF FF FF FF 00 00 00 00 00 00
    3E 3E 3E 3E 3E FE FE FE FE FE 00 00 00 00 00 00
    0F 0F 0F 0F 0F 0F 0F 0F 0F 0F 00 00 00 00 00 00
    80 80 80 80 80 80 80 80 80 80 00 00 00 00 00 00
    """
    code = """
    00 E0
    60 00 61 0D 
    62 0B F2 29 
    D0 15       
    12 0C
    """
    dump_ch8(code2,'testProg.ch8')
    #clear display
    #usually v0 =x coord, v1=y coord
    # v2 = letter I = sprite(v2)
    #draw(v0,v1) 5lines
    #jump to 0c,subroutine loop

if __name__ == "__main__":
    main()
