const ScheduleDate = () => {
  const next = () => {
    let nowDate = new Date();
    // let hours = nowDate.getUTCHours();
    // let newHours = Math.floor(hours / 4) * 4 + 4;
    // nowDate.setUTCHours(newHours);
    // nowDate.setUTCMinutes(0);
    // nowDate.setUTCSeconds(0);

    let minutes = nowDate.getUTCMinutes();
    let newMinutes = Math.floor(minutes / 5) * 5 + 5;
    nowDate.setUTCMinutes(newMinutes);
    nowDate.setUTCSeconds(0);

    return nowDate.toISOString();
  }

  return {
    next
  }
}

export { ScheduleDate };