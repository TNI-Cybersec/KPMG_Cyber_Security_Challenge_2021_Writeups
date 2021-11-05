# Shabondy
### Shabondy.exe
```cmd
Please input the correct password : ...
```

## Patching

### Disassembling
- Use [**IDA Freeware**](https://hex-rays.com/ida-free/), a disassembler software, to disassembly the program
- Inspecting the instructions graph...  
      ![Imgur](https://imgur.com/fWYHNzD.png)  
    - a bit closer...  
      ![Imgur](https://imgur.com/9UPU2Pj.png)
      ![Imgur](https://imgur.com/0aqkV70.png)
    - Look at the `jnz` (Jump Not Zero) instruction  
      ![Imgur](https://imgur.com/k7M3O7J.png)  
    - Notice that conditional jump instruction link to this node address (`loc_401AC7`)...  
      ![Imgur](https://imgur.com/GA0jsro.png)
      
> **Idea** : Change the conditional jump (`jnz`) into unconditinal jump instruction (`jmp`) with the right address—the right node according to the above picture that will give the correct answer

- Patch the program
    - First, assign address name to the right node
    - Highlight the target instruction (`jnz loc_401AC7`)
    - `Edit` -> `Patch Program` -> `Assemble...`
    - Replace with the new instruction: `jmp <right_address_name>`     
    - `Edit` -> `Patch Program` -> `Apply patches to input file...`
    - Run the patched program...

### Result
```cmd
Please input the correct password : .  // Input anything will do
You are on the right way: UEYM{RTXRY_EUXKIQY}
Key : 'KPMG'
Tip : 1.special characters and blank spaces are ignored.
      2.Please submit all flag with capital letters.
```

### OK Google
> Me : ["What is ciphertext with key?"](https://www.google.co.th/search?q=ciphertext+with+key)
>> Google : ["Vigenere Cipher"](https://www.dcode.fr/vigenere-cipher)

### Decrypting...
```
Flag : KPMG{HELLO_PIRATES}
```

## The True Password
```cmd
Please input the correct password : KMGPas8M0rP{}$8@b0endW8yKPMR3f3R
```

> **Tip** : Press `F5` to decompile the assembly
