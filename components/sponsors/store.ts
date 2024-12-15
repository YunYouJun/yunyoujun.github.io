import type { RankSponsor } from '@yunyoujun/sponsors'
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

  /**
   * 详细列表里是之前手动添加的赞助数据
   */
  const sponsors = ref<RankSponsor[]>([])

  /**
   * 获取支出详细数据
   */
  async function fetchExpensesData() {
    const expensesData = await fetch('https://sponsors.yunyoujun.cn/data/expenses.json')
      .then(res => res.json())

    expenses.value = expensesData
    return expensesData
  }

  /**
   * 获取手动添加的赞助数据
   */
  async function fetchManualSponsorsData() {
    const manualSponsorsData = await fetch('https://sponsors.yunyoujun.cn/data/manual-sponsors.json').then(res => res.json())
    sponsors.value = manualSponsorsData.filter((i: RankSponsor) => i.total >= minAccount)
  }

  return {
    expenses,
    sponsors,

    fetchExpensesData,
    fetchManualSponsorsData,
  }
})
