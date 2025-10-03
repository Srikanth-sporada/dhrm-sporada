import { SalaryApprovalDeptFilterPipe } from './pipes/salary-approval-dept-filter.pipe';

describe('SalaryApprovalDeptFilterPipe', () => {
  it('create an instance', () => {
    const pipe = new SalaryApprovalDeptFilterPipe();
    expect(pipe).toBeTruthy();
  });
});
