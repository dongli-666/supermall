import BackTop from 'components/content/backTop/BackTop'

export const backTopMnxin = {
  components: {
    BackTop
  },
  data() {
    return {
      isShowBackTop: false,
    }
  },
  methods: {
    backClick() {    //回到顶部
      this.$refs.scroll.scrollTo(0, 0);
    },
  },
}