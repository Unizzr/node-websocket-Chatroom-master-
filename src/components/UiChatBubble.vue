<template>
  <div class="chat-bubble-warp"
       :class="{
        'chat-bubble-send':isSend,
        'chat-bubble-receive':!isSend,
        'recalled-message':message.isRecalled
       }"
       @mouseenter="handleMouseEnter"
       @mouseleave="handleMouseLeave"
       @touchstart="handleTouchStart"
       @touchend="handleTouchEnd"
  >
    <div class="chat-bubble-avatar">
      <img :src="message.from.avatarUrl" alt="">
    </div>
    <div class="chat-bubble-container">
      <div class="chat-bubble-infoWarp" v-if="setting.isName">
        <span class="chat-bubble-time" v-if="setting.isTime&&isSend" slot="time">{{message.time | friendlyTime}}</span>
        <span class="chat-bubble-name">{{message.from.name}}</span>
        <span class="chat-bubble-time" v-if="setting.isTime&&!isSend" slot="time">{{message.time | friendlyTime}}</span>
      </div>
      <div class="chat-bubble-content">
        <div slot="content" v-if="!message.isRecalled">
          <UiEmojiText :text="message.content" v-if="message.type==='text'"></UiEmojiText>
          <div v-if="message.type==='image'">
            <template v-if="message.content==='【图片】'">
              {{message.content}}
            </template>
            <img :src="message.content" alt="图片" v-else>
          </div>
        </div>
        <div class="recalled-content" v-else>
          <span class="recall-icon">✕</span>
          <span class="recall-text">该消息已撤回</span>
        </div>
      </div>
      <div class="chat-bubble-actions" v-if="showActions && isSend && canRecall">
        <button class="action-btn recall-btn" @click.stop="handleRecall" :disabled="!canRecall">
          <span class="btn-text">撤回</span>
          <span class="btn-countdown" v-if="remainingTimeText">({{remainingTimeText}})</span>
        </button>
      </div>
    </div>
    <div class="context-menu" v-if="showContextMenu && isSend && canRecall">
      <button class="context-menu-item" @click.stop="handleRecall">
        <span class="menu-item-text">撤回</span>
        <span class="menu-item-countdown" v-if="remainingTimeText">({{remainingTimeText}})</span>
      </button>
    </div>
  </div>
</template>

<script>
  import UiEmojiText from "./UiEmojiText";
  import {formatTime,friendlyTime,canRecall,getRecallRemainingTime,formatRecallTime} from "./filters";
  export default {
    name: "UiChatBubble",
    components:{
      UiEmojiText,
    },
    filters:{
      friendlyTime,
      formatTime
    },
    props:{
      isSend:{
        type:Boolean,
        default:false
      },
      setting:{
        type: Object,
        default(){
          return {
            isName:true,
            isTime:true
          }
        }
      },
      message:{
        type:Object,
        default() {
          return {
            from:{
              name:"似水流年",
              avatarUrl:"http://himg.bdimg.com/sys/portrait/item/90193135323338383137313237bc13.jpg"
            },
            content:"这是一条[微笑]测试信息1112222222[气球]2222222",
            time:new Date().getTime(),
            type:"text"
          };
        }
      }
    },
    data(){
      return {
        showActions:false,
        showContextMenu:false,
        countdownTimer:null,
        remainingTimeText:''
      }
    },
    computed:{
      canRecall(){
        return this.isSend && canRecall(this.message);
      }
    },
    watch:{
      canRecall:{
        handler(newVal){
          if(newVal){
            this.startCountdown();
          }else{
            this.stopCountdown();
            this.showActions = false;
            this.showContextMenu = false;
          }
        },
        immediate:true
      }
    },
    methods:{
      handleMouseEnter(){
        if(this.canRecall){
          this.showActions = true;
        }
      },
      handleMouseLeave(){
        this.showActions = false;
        this.showContextMenu = false;
      },
      handleTouchStart(){
        if(this.canRecall){
          this.touchTimer = setTimeout(()=>{
            this.showContextMenu = true;
          }, 500);
        }
      },
      handleTouchEnd(){
        if(this.touchTimer){
          clearTimeout(this.touchTimer);
          this.touchTimer = null;
        }
      },
      handleRecall(){
        this.showActions = false;
        this.showContextMenu = false;
        this.$emit('recall', this.message);
      },
      startCountdown(){
        this.updateCountdown();
        this.countdownTimer = setInterval(()=>{
          this.updateCountdown();
        }, 1000);
      },
      stopCountdown(){
        if(this.countdownTimer){
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
        }
      },
      updateCountdown(){
        const {minutes, seconds} = getRecallRemainingTime(this.message.time);
        if(minutes === 0 && seconds === 0){
          this.remainingTimeText = '';
          this.stopCountdown();
        }else{
          this.remainingTimeText = formatRecallTime(minutes, seconds);
        }
      }
    },
    beforeDestroy(){
      this.stopCountdown();
    }
  }
</script>

<style scoped>
  .chat-bubble-warp{
    position: relative;
  }
  .chat-bubble-warp:after{
    display: table;
    content: '';
    clear: both;
  }
  .chat-bubble-avatar,
  .chat-bubble-avatar img{
    display: block;
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }
  .chat-bubble-send .chat-bubble-avatar{
    float: right;
  }
  .chat-bubble-send .chat-bubble-infoWarp,
  .chat-bubble-send .chat-bubble-container{
    text-align: right;
  }
  .chat-bubble-send .chat-bubble-container .chat-bubble-content{
    text-align: left;
  }
  .chat-bubble-receive .chat-bubble-avatar{
    float: left;
  }
  .chat-bubble-container{
    position: relative;
    margin-left: 50px;
    margin-right: 50px;
  }
  .chat-bubble-infoWarp .chat-bubble-name{
    font-size: 14px;
    color: #333333;
    line-height: 20px;
  }
  .chat-bubble-infoWarp .chat-bubble-time{
    font-size: 12px;
    color: #666666;
    line-height: 20px;
    margin-left: 10px;
    margin-right: 10px;
  }
  .chat-bubble-content{
    display: inline-block;
    min-height: 20px;
    padding: 10px;
    border-radius: 4px;
    max-width: 100%;
    line-height: 20px;
    vertical-align: middle;
    color: #666666;
    font-size: 14px;
    word-break: break-word;
    position: relative;
  }
  .chat-bubble-receive .chat-bubble-content:before,
  .chat-bubble-send .chat-bubble-content:after{
    position: absolute;
    content: '';
    width: 0;
    height: 0;
    border-top: 5px solid transparent;
    border-bottom: 5px solid transparent;
    top: 20px;
    margin-top: -5px;
  }
  .chat-bubble-receive .chat-bubble-content:before{
    right: 100%;
    border-right: 5px solid #dae1ff;
  }
  .chat-bubble-receive .chat-bubble-content{
    background-color: #dae1ff;
  }
  .chat-bubble-send .chat-bubble-content:after{
    left: 100%;
    border-left: 5px solid #aae97e;
  }
  .chat-bubble-send .chat-bubble-content{
    background-color: #aae97e;
  }
  .chat-bubble-content/deep/ img{
    max-width: 100%;
  }
  .chat-bubble-content/deep/ img.emoji-img{
    width: 20px;
    height: 20px;
    vertical-align: middle;
    position: relative;
    top: -2px;
  }
  .recalled-message .chat-bubble-content{
    background-color: transparent;
    border: 1px dashed #ccc;
    color: #999;
  }
  .recalled-message .chat-bubble-content:before,
  .recalled-message .chat-bubble-content:after{
    display: none;
  }
  .recalled-content{
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: italic;
    padding: 8px 12px;
  }
  .recall-icon{
    margin-right: 6px;
    font-size: 14px;
    color: #999;
  }
  .recall-text{
    font-size: 13px;
    color: #999;
  }
  .chat-bubble-actions{
    position: absolute;
    top: 0;
    right: 60px;
    z-index: 10;
  }
  .chat-bubble-send .chat-bubble-actions{
    right: 60px;
  }
  .chat-bubble-receive .chat-bubble-actions{
    left: 60px;
    right: auto;
  }
  .action-btn{
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: 12px;
    cursor: pointer;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: all 0.2s;
  }
  .action-btn:hover{
    background: #f5f5f5;
    border-color: #bbb;
  }
  .action-btn:disabled{
    opacity: 0.5;
    cursor: not-allowed;
  }
  .btn-text{
    color: #666;
  }
  .btn-countdown{
    color: #999;
    margin-left: 4px;
    font-size: 11px;
  }
  .context-menu{
    position: fixed;
    z-index: 9999;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    padding: 4px 0;
    min-width: 100px;
  }
  .context-menu-item{
    background: none;
    border: none;
    padding: 10px 16px;
    width: 100%;
    text-align: left;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .context-menu-item:hover{
    background: #f5f5f5;
  }
  .menu-item-text{
    color: #333;
    font-size: 14px;
  }
  .menu-item-countdown{
    color: #999;
    font-size: 12px;
    margin-left: 8px;
  }
  @media (max-width: 640px){
    .chat-bubble-actions{
      display: none;
    }
  }
</style>
