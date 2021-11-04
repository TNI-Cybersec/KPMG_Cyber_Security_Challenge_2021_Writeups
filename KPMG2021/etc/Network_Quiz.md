# Network Quiz

![Imgur](https://imgur.com/PvWS72z.jpg)

### Problem
> There are `...` collision domains and `...` broadcast domains.

### Answer
> `17, 7`

## Quick Note
**Port** ของ **Router** แบ่ง `Broadcast` และ `Collision Domain` ส่วน **Switch** *(ไม่แบ่ง VLAN)* แบ่ง `Collision Domain`  
แต่ **Hub** ไม่ว่าจะมีกี่ port ก็มีแค่ 1 CD ตัวอย่างตามตารางด้านล่าง

| Device | Ports | CD | BD |
|--------|:-----:|:--:|:--:|
| Router | 5     | 5  | 5  |
| Switch | 5     | 5  | 1  |
| Hub    | 5     | 1  | 1  |

<!--
- **Router** `5` Ports = `5` CD / `5` BD
- **Switch** `5` Ports (No VLAN) = `5` CD / `1` BD
- **Hub** `5` Ports = `1` CD / `1` BD
-->

**อ่านเพิ่มเติม** : [วิธีการนับ Collision Domain และ Broadcast Domain](https://www.jodoi.com/book/collision_broadcast_domain.pdf)
