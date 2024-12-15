import type { OtherSponsor, RankSponsor } from '@yunyoujun/sponsors'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'

const state = reactive({
  income: 0,
  expense: 0,
})

export const store = {
  state,

  balance: computed(() => state.income - state.expense),

  setIncome(val: number) {
    this.state.income = val
  },

  setExpense(val: number) {
    this.state.expense = val
  },
}

export function sumIncome(sponsors: RankSponsor[]) {
  let total = 0
  sponsors.forEach((sponsor) => {
    total += sponsor.total
  })
  store.setIncome(total)
}

export interface Expense {
  memo: string
  business: string
  amount: number
  date: Date
}

export function sumExpense(expenses: Expense[]) {
  let total = 0
  expenses.forEach((expense: Expense) => {
    total += expense.amount
  })
  store.setExpense(total)
}

export const minAccount = 6

export const useSponsorStore = defineStore('sponsor', () => {
  const expenses = ref<Expense[]>([])

  const isLoading = ref(false)

  /**
   * 详细列表里是之前手动添加的赞助数据
   */
  const sponsors = ref<RankSponsor[]>([])
  const specialSponsors = ref<OtherSponsor[]>([])

  /**
   * 获取支出详细数据
   */
  async function fetchExpensesData() {
    if (expenses.value.length !== 0)
      return

    isLoading.value = true
    const expensesData = await fetch('https://sponsors.yunyoujun.cn/data/expenses.json')
      .then(res => res.json())

    expenses.value = expensesData
    isLoading.value = false
    return expensesData
  }

  /**
   * 获取手动添加的赞助数据
   */
  async function fetchManualSponsorsData() {
    if (sponsors.value.length !== 0)
      return

    isLoading.value = true
    const manualSponsorsData = await fetch('https://sponsors.yunyoujun.cn/data/manual-sponsors.json').then(res => res.json())
    sponsors.value = manualSponsorsData.filter((i: RankSponsor) => i.total >= minAccount)
    isLoading.value = false
  }

  /**
   * 获取特别赞助信息
   */
  async function fetchSpecialSponsorsData() {
    if (specialSponsors.value.length !== 0)
      return

    isLoading.value = true
    const sponsorData = await fetch('https://sponsors.yunyoujun.cn/data/special-sponsors.json')
      .then(res => res.json())
    specialSponsors.value = sponsorData
    isLoading.value = false
    return sponsorData
  }

  return {
    expenses,
    sponsors,
    specialSponsors,

    isLoading,

    fetchExpensesData,
    fetchManualSponsorsData,
    fetchSpecialSponsorsData,
  }
})
