export const adminVerification = {
  ADMIN_CODES: ['ADMIN2024', 'CBS_ADMIN'],
  verify(code: string): boolean {
    return this.ADMIN_CODES.includes(code);
  },

  async verifySync(code: string): Promise<boolean> {

    try {
      return await $fetch(`/api/admin/verify`, {
        method: "POST",
        body: {code}
      });
    } catch (err) {
      return false
    }

  }

}