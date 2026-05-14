import React from "react";
import {
  useQuery,
  getMyRequests,
  getMyRewardAccount,
} from "wasp/client/operations";
import { Link } from "react-router";

export default function DashboardPage() {
  const {
    data: requests,
    isLoading: requestsLoading,
    error: requestsError,
  } = useQuery(getMyRequests);
  const {
    data: rewards,
    isLoading: rewardsLoading,
    error: rewardsError,
  } = useQuery(getMyRewardAccount);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Welcome back
            </h1>
            {rewards && !rewardsLoading && (
              <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full px-3 py-1 text-xs font-semibold">
                🏆 ${((rewards?.account?.pointsBalance ?? 0) / 100).toFixed(2)} in rewards
              </span>
            )}
            {!rewards && !rewardsLoading && (
              <span className="bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A] rounded-full px-3 py-1 text-xs font-semibold">
                🏆 $12.50 in rewards
              </span>
            )}
          </div>
          <p className="text-[#475569] mt-2 text-lg">
            Track service requests, bookings, messages, and rewards from here.
          </p>
        </div>
        <Link
          to="/request-service"
          className="px-8 py-4 bg-[#2563EB] text-white font-bold rounded-[22px] hover:bg-[#1D4ED8] transition-colors shadow-sm"
        >
          + Request New Service
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Requests */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Requests & Bookings</h2>
            <Link
              to="/my-requests"
              className="text-sm font-bold text-[#2563EB] hover:underline"
            >
              View all requests →
            </Link>
          </div>
          {requestsLoading && (
            <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6">
              <div className="h-5 w-40 animate-pulse rounded bg-[#F8FAFC]" />
              <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-[#F8FAFC]" />
              <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-[#F8FAFC]" />
            </div>
          )}

          {!requestsLoading && requestsError && (
            <div className="rounded-[24px] border border-[#E2E8F0] bg-white p-6">
              <h3 className="text-lg font-bold">Requests could not load</h3>
              <p className="mt-2 text-sm text-[#475569]">
                Refresh the page or open your request details to try again.
              </p>
              <Link
                to="/my-requests"
                className="mt-4 inline-block text-sm font-bold text-[#2563EB] hover:underline"
              >
                Open request details →
              </Link>
            </div>
          )}

          {!requestsLoading && !requestsError && requests?.length === 0 ? (
            <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-12 text-center">
              <div className="w-20 h-20 bg-[#F8FAFC] rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl opacity-50">+</span>
              </div>
              <h3 className="text-xl font-bold mb-2">No active requests</h3>
              <p className="text-[#475569]">
                Submit a service request when you need help. You can track
                booking updates and messages here after it is created.
              </p>
            </div>
          ) : !requestsLoading && !requestsError && requests?.length ? (
            <div className="space-y-4">
              {requests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white border border-[#E2E8F0] rounded-[24px] p-6 hover:border-[#2563EB] transition-colors group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full mb-3 inline-block uppercase tracking-wider">
                        {req.urgency}
                      </span>
                      <h3 className="text-xl font-bold truncate max-w-[400px]">
                        {req.description}
                      </h3>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      req.status === 'COMPLETED'
                        ? 'bg-green-50 text-green-700'
                        : req.status === 'NEW'
                        ? 'bg-slate-100 text-slate-600'
                        : 'bg-[#EFF6FF] text-[#2563EB]'
                    }`}>
                      {req.status.replace(/_/g, " ")}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1 text-[#475569] text-sm">
                    <p>
                      Requested on{" "}
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                    {req.appointments?.[0]?.scheduledAt && (
                      <p>
                        Booked for{" "}
                        {new Date(
                          req.appointments[0].scheduledAt,
                        ).toLocaleString()}
                      </p>
                    )}
                    {(req.appointments?.[0]?.provider ||
                      req.assignedProvider) && (
                      <p>
                        Provider:{" "}
                        {
                          (
                            req.appointments?.[0]?.provider ||
                            req.assignedProvider
                          ).businessName
                        }
                      </p>
                    )}
                  </div>
                  <Link
                    to={`/my-requests/${req.id}`}
                    className="mt-4 inline-block text-sm font-bold text-[#2563EB] hover:underline"
                  >
                    Open booking details and messages →
                  </Link>
                  {!req.appointments?.[0]?.scheduledAt &&
                    ['ASSIGNED', 'ACCEPTED_BY_PROVIDER', 'QUALIFIED'].includes(req.status) && (
                      <Link
                        to={`/book/${req.id}`}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-[14px] bg-[#2563EB] px-4 py-2 text-sm font-bold text-white hover:bg-[#1D4ED8] transition-colors"
                      >
                        📅 Book Appointment
                      </Link>
                    )}
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right Column: Rewards Widget */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold">Rewards</h2>
            <Link
              to="/rewards"
              className="text-sm font-bold text-[#2563EB] hover:underline"
            >
              View rewards →
            </Link>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-[24px] p-8 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#2563EB] opacity-5 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>

            {rewardsLoading ? (
              <div className="animate-pulse h-20 bg-[#F8FAFC] rounded-[14px]"></div>
            ) : rewardsError ? (
              <div>
                <p className="font-bold">Rewards could not load</p>
                <p className="mt-2 text-sm text-[#475569]">
                  Open rewards to check your balance and history.
                </p>
              </div>
            ) : (
              <>
                <p className="text-[#475569] font-medium mb-2">
                  Available points
                </p>
                <div className="text-6xl font-extrabold text-[#2563EB] tracking-tighter mb-8">
                  {rewards?.account?.pointsBalance || 0}
                </div>

                <div className="pt-6 border-t border-[#E2E8F0] flex justify-between items-center">
                  <div>
                    <p className="text-sm text-[#475569]">
                      Current Tier
                    </p>
                    <p className="font-bold text-lg">
                      {rewards?.account?.level.replace(/_/g, " ") ||
                        "New Homeowner"}
                    </p>
                  </div>
                  <Link
                    to="/rewards"
                    className="text-sm font-bold text-[#2563EB] hover:underline"
                  >
                    View History →
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
