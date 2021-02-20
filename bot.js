const { Client, MessageEmbed } = require("discord.js");
const client = new Client({ignoreDirect: true, ignoreRoles: true, ignoreEveryone: true});
client.setMaxListeners(50);
const request = require("request");
const ayarlar = require("./ayarlar.json")

const prefix = ayarlar.prefix
const güvenlix = ayarlar.güvenli
const sunucu = ayarlar.sunucuID
const logkanal = ayarlar.guardlog
const arr = ayarlar.perm
const botrole = ayarlar.botrole

client.on("ready", async () => {
    console.log(`Bot Başarı İle Aktif Oldu`);
    client.user.setPresence(`TEST QWEQWQEQW`, { type: "WATCHING"});
    client.user.setStatus("online");
    });

// SAĞ TIK BAN KORUMASI     
client.on("guildBanAdd", async (guild, user) => {
const logs = await guild.fetchAuditLogs({ limit: 1, type: "MEMBER_BAN_ADD" });
const log = logs.entries.first();
if (!log) return;
const target = log.target;
const id = log.executor.id;
if (!güvenlix.includes(id)) {
let users = guild.members.cache.get(id);
let kullanici = guild.members.cache.get(client.user.id);
users.kick()
const embed = new MessageEmbed()
.setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Üyeyi Yasakladı.
**__Yasaklanan Kullanıcı Bilgisi__**
\`Kullanıcı:\` ${target}
\`ID:\` ${target.id}
\`Tag:\` ${target.tag}

**__Yasaklayan Kullanıcı Bilgisi__**
\`Kullanıcı:\` ${users}
\`ID:\` ${users.id}
\`Tag:\` ${users.user.tag}

**__Rol Bilgisi__**
\`Rol:\` <@&${ayarlar.jailrole}>
\`ID:\` ${ayarlar.jailrole}

**${users.user.tag}** Kullanıcısının Sunucuda Kickledim.`)
client.channels.cache.get(logkanal).send(embed)
}})
// KANAL AÇMA KORUMASI
client.on("channelCreate", async (channel) => {
  const guild = channel.guild;
  guild.fetchAuditLogs().then(async (logs) => {
  if(logs.entries.first().action === `CHANNEL_CREATE`) {
  const id = logs.entries.first().executor.id;
  if(!güvenlix.includes(id)) {
  const users = guild.members.cache.get(id);
  const kullanici = guild.members.cache.get(client.user.id);    
    users.kick()
    channel.delete()
    const embed = new MessageEmbed()
    .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Kanal Oluşturdu.
    **__Kullanıcı Bilgisi__**
    \`Kullanıcı:\` ${users}
    \`ID:\` ${users.id}
    \`Tag:\` ${users.user.tag}
    
    **__Kanal Bilgisi__**
    \`Kanal:\` #${channel.name}
    \`ID:\` ${channel.id} 
    
    **${users.user.tag}** Kullanıcısının Sunucuda Kickledim.
    Oluşturulan **${channel.name}** Kanalını Sildim.`)
    client.users.cache.get(channel.guild.ownerID).send(embed)
  }}})})

// KANAL SİLME KORUMASI
client.on("channelDelete", async (channel) => {
  const guild = channel.guild;
  guild.fetchAuditLogs().then(async (logs) => {
  if (logs.entries.first().action === `CHANNEL_DELETE`) {
  const id = logs.entries.first().executor.id;
  if (!güvenlix.includes(id)) {
  const users = guild.members.cache.get(id);
  const kullanici = guild.members.cache.get(client.user.id);
 
    users.kick()
    await channel.clone().then(async kanal => {
      if (channel.parentID != null) await kanal.setParent(channel.parentID);
      await kanal.setPosition(channel.position);
      if (channel.type == "category") await channel.guild.channels.cache.filter(k => k.parentID == channel.id).forEach(x => x.setParent(kanal.id));
    });
    const embed = new MessageEmbed()
    .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Kanal Sildi.
    **__Kullanıcı Bilgisi__**
    \`Kullanıcı:\` ${users}
    \`ID:\` ${users.id}
    \`Tag:\` ${users.user.tag}
    
    **__Kanal Bilgisi__**
    \`Kanal:\` #${channel.name}
    \`ID:\` ${channel.id} 
    
    **${users.user.tag}** Kullanıcısının Sunucuda Kickledim.
    Silinen **${channel.name}** Kanalını Tekrar Oluşturdum.`)
    client.channels.cache.get(logkanal).send(embed)
  }}})})


  // rol silme 
  client.on("roleDelete", async (role) => {
    const guild = role.guild;
    let sil = guild.roles.cache.get(role.id);
    guild.fetchAuditLogs().then(async (logs) => {
    if(logs.entries.first().action === `ROLE_DELETE`) {
    const id = logs.entries.first().executor.id;
    if(!güvenlix.includes(id)) {
    const users = guild.members.cache.get(id);
    const kullanici = guild.members.cache.get(client.user.id);
    let yeniRol = await role.guild.roles.create({
      data: {
        name: role.name,
        color: role.hexColor,
        hoist: role.hoist,
        position: role.position,
        permissions: role.permissions,
        mentionable: role.mentionable
      }
    });
users.kick()
      const embed = new MessageEmbed()
      .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Rol Sildi.
      **__Kullanıcı Bilgisi__**
      \`Kullanıcı:\` ${users}
      \`ID:\` ${users.id}
      \`Tag:\` ${users.user.tag}
      
      **__Rol Bilgisi__**
      \`Rol:\` @${role.name}
      \`ID:\` ${role.id} 
      \`HexColor:\` ${role.hexColor} 
     
      **${users.user.tag}** Kullanıcısının Sunucuda Kickledim.
      Silinen **${role.name}** Rolünü Tekrar Oluşturdum.`)
      client.channels.cache.get(logkanal).send(embed)
    }}})})

// rol oluşturma
client.on("roleCreate", async (role) => {
  let guild = role.guild;
  guild.fetchAuditLogs().then(async (logs) => {
  if(logs.entries.first().action === `ROLE_CREATE`) {
  let id = logs.entries.first().executor.id;
  if(!güvenlix.includes(id)) {
  let users = guild.members.cache.get(id);
  let kullanici = guild.members.cache.get(client.user.id);
  role.delete();
 users.kick()
    const embed = new MessageEmbed()
    .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Rol Oluşturdu.
    **__Kullanıcı Bilgisi__**
    \`Kullanıcı:\` ${users}
    \`ID:\` ${users.id}
    \`Tag:\` ${users.user.tag}
    
    **__Rol Bilgisi__**
    \`Rol:\` @${role.name}
    \`ID:\` ${role.id} 
    \`HexColor:\` ${role.hexColor} 
   
    **${users.user.tag}** Kullanıcısının Sunucuda Kickledim.
    Oluşturulan **${role.name}** Rolünü Sildim.`)
    client.channels.cache.get(logkanal).send(embed)
  }}})})


  // rol düzenleme koruma
  client.on("roleUpdate", async (oldRole, newRole) => {
    let guild = newRole.guild;
    guild.fetchAuditLogs().then(async (logs) => {
    if(logs.entries.first().action === `ROLE_UPDATE`) {
let id = logs.entries.first().executor.id;
  if(!güvenlix.includes(id)) {
  let users = guild.members.cache.get(id);
    if (arr.some(p => !oldRole.permissions.has(p) && newRole.permissions.has(p))) {
      newRole.setPermissions(oldRole.permissions);
      newRole.guild.roles.cache.filter(r => !r.managed && (r.permissions.has("ADMINISTRATOR") || r.permissions.has("MANAGE_ROLES") || r.permissions.has("MANAGE_GUILD"))).forEach(r => r.setPermissions(36818497));
    };
    newRole.edit({
      name: oldRole.name,
      color: oldRole.hexColor,
      hoist: oldRole.hoist,
      permissions: oldRole.permissions,
      mentionable: oldRole.mentionable
    });
      users.kick()
      const embed = new MessageEmbed()
      .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Rol Düzenledi.
      **__Kullanıcı Bilgisi__**
      \`Kullanıcı:\` ${users}
      \`ID:\` ${users.id}
      \`Tag:\` ${users.user.tag}
      
      **__Düzenlenen Rol Bilgisi__**
      \`Rol:\` @${newRole.name}
      \`ID:\` ${newRole.id} 
      \`HexColor:\` ${newRole.hexColor} 
     
      **__Eski Haline Getirilen Rol Bilgisi__**
      \`Rol:\` @${oldRole.name}
      \`ID:\` ${oldRole.id} 
      \`HexColor:\` ${oldRole.hexColor} 

      **${users.user.tag}** Kullanıcısının Sunucuda Kickledim.
      Düzenlenen **${oldRole.name}** Rolünü Eski Haline Getirdim.`)
      client.channels.cache.get(logkanal).send(embed)
    }}})})

    // kanal düzenleme koruma
    client.on("channelUpdate", async (oldChannel, newChannel) => {
      let guild = newChannel.guild;
      guild.fetchAuditLogs().then(async (logs) => {
      if(logs.entries.first().action === `CHANNEL_UPDATE`) {
  let id = logs.entries.first().executor.id;
    if(!güvenlix.includes(id)) {
    let users = guild.members.cache.get(id);
      if (newChannel.type !== "category" && newChannel.parentID !== oldChannel.parentID) newChannel.setParent(oldChannel.parentID);
      if (newChannel.type === "category") {
        newChannel.edit({
          name: oldChannel.name,
        });
      } else if (newChannel.type === "text") {
        newChannel.edit({
          name: oldChannel.name,
          topic: oldChannel.topic,
          nsfw: oldChannel.nsfw,
          rateLimitPerUser: oldChannel.rateLimitPerUser
        });
      } else if (newChannel.type === "voice") {
        newChannel.edit({
          name: oldChannel.name,
          bitrate: oldChannel.bitrate,
          userLimit: oldChannel.userLimit,
        });
      };
      oldChannel.permissionOverwrites.forEach(perm => {
        let thisPermOverwrites = {};
        perm.allow.toArray().forEach(p => {
          thisPermOverwrites[p] = true;
        });
        perm.deny.toArray().forEach(p => {
          thisPermOverwrites[p] = false;
        });
        newChannel.createOverwrite(perm.id, thisPermOverwrites);
      });
      users.kick()
        const embed = new MessageEmbed()
        .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Kanal Düzenledi.
        **__Kullanıcı Bilgisi__**
        \`Kullanıcı:\` ${users}
        \`ID:\` ${users.id}
        \`Tag:\` ${users.user.tag}
        
        **__Düzenlenen Kanal Bilgisi__**
        \`Rol:\` #${newChannel.name}
        \`ID:\` ${newChannel.id} 
       
        **__Eski Haline Getirilen Kanal Bilgisi__**
        \`Rol:\` #${oldChannel.name}
        \`ID:\` ${oldChannel.id} 
  
        **${users.user.tag}** Kullanıcısının Sunucuda Kickledim.
        Düzenlenen **${oldChannel.name}** Kanalını Eski Haline Getirdim.`)
        client.channels.cache.get(logkanal).send(embed)
    }}})})

// weebhok koruma 
    client.on("webhookUpdate", async (channel) => {
      let guild = channel.guild;
      guild.fetchAuditLogs().then(async (logs) => {
      if (logs.entries.first().action === `WEBHOOK_CREATE`) {
      let yetkili = logs.entries.first().executor;
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
      let users = guild.members.cache.get(id);
      let kullanic = guild.members.cache.get(client.user.id);
      users.kick()
      const embed = new MessageEmbed()
      .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Bir Webhook (Açtı - Düzenledi - Sildi).
      **__Kullanıcı Bilgisi__**
      \`Kullanıcı:\` ${users}
      \`ID:\` ${users.id}
      \`Tag:\` ${users.user.tag}
      
      **__Webhook Bilgisi__**
      \`Webhook Kanalı:\` #${channel.name}
     
      **${users.user.tag}** Kullanıcısının Tüm Rollerini Alıp Jaile Gönderdim
      `)
      client.channels.cache.get(logkanal).send(embed)
      }}})})
/// bot koruma
      client.on("guildMemberAdd", async (member) => {
        const guild = member.guild;
        guild.fetchAuditLogs().then(async (logs) => {
        if(logs.entries.first().action === `BOT_ADD`) {
        const id = logs.entries.first().executor.id;
        if(!güvenlix.includes(id)) {
        if(member.user.bot){
        const users = guild.members.cache.get(id);
        const kullanici = guild.members.cache.get(client.user.id);
        users.kick()
          const embed = new MessageEmbed()
      .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Sunucuya Bir Bot Ekledi.
      **__Kullanıcı Bilgisi__**
      \`Kullanıcı:\` ${users}
      \`ID:\` ${users.id}
      \`Tag:\` ${users.user.tag}
      
      **__Eklenen Bot Bilgisi__**
      \`Bot:\` ${member}
      \`ID:\` ${member.id}
      \`Tag:\` ${member.user.tag}

      **${users.user.tag}** Kullanıcısının Sunucuda Kickledim.
      Eklenen **${member.user.tag}** Botunu Sunucudan Yasakladım.
      `)
      member.ban()
      client.channels.cache.get(logkanal).send(embed)
        }}}})})

        // sunucu koruma
        client.on("guildUpdate", async (oldGuild, newGuild) => {
          let guild = newGuild.guild
      let logs = await newGuild.fetchAuditLogs({type: 'GUILD_UPDATE'})
      let yetkili = logs.entries.first().executor;
      let id = logs.entries.first().executor.id;
      if (!güvenlix.includes(id)) {
      let users = guild.members.cache.get(id);
      let kullanic = guild.members.cache.get(client.user.id);
          if (newGuild.name !== oldGuild.name) newGuild.setName(oldGuild.name);
          if (newGuild.iconURL({dynamic: true, size: 2048}) !== oldGuild.iconURL({dynamic: true, size: 2048})) newGuild.setIcon(oldGuild.iconURL({dynamic: true, size: 2048}));
         users.kick()
            const embed = new MessageEmbed()
        .setDescription(`${users} (\`${users.id}\`) Kullanıcısı Sunucu Ayarlarında Değişiklilik Yaptı.
        **__Kullanıcı Bilgisi__**
        \`Kullanıcı:\` ${users}
        \`ID:\` ${users.id}
        \`Tag:\` ${users.user.tag}
         
        **${users.user.tag}** Kullanıcısının Sunucuda Kickledim.
        Sunucuyu Eski Haline Getirdim
        `)
        client.channels.cache.get(logkanal).send(embed)
          }})       
      client.login(process.env.token)